import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./EditPlansOfAction.module.scss";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import { useSearchParams } from "react-router-dom";
import Button from "../../../components/UI/Button/Button";
import Icon from "../../../components/UI/Icon/Icon";
import Title from "../../../components/UI/Title/Title";
import Draggable from "react-draggable";

interface EditPlansOfActionProps {}

const EditPlansOfAction: FC<EditPlansOfActionProps> = () => {
  const [tempId, setTempId] = useState(0);
  const [plansOfAction, setPlansOfAction] = useState<
    PlanOfAction[] | "denied"
  >();
  const [searchParams] = useSearchParams();
  const activePlans =
    plansOfAction !== "denied"
      ? plansOfAction?.filter((plan) => plan.status === "active")
      : undefined;
  const completedPlans =
    plansOfAction !== "denied"
      ? plansOfAction?.filter((plan) => plan.status === "completed")
      : undefined;
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const ref = useRef(null);
  const childRefs = useRef<HTMLDivElement[]>([]);
  const completedRef = useRef<HTMLDivElement>(null);
  const [currentDragged, setCurrentDragged] = useState<string>();

  async function dummyFetch(): Promise<PlanOfAction[] | "denied"> {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            {
              id: "#1",
              title: "complete this page",
              status: "active",
            },
            {
              id: "#2",
              title: "what ARE hooks, really?",
              status: "active",
            },
            {
              id: "#3",
              title: "pick a layout",
              status: "completed",
            },
            {
              id: "#4",
              title: "no sql",
              status: "completed",
            },
          ]),
        500
      )
    );
  }

  const fetchPlans = useCallback(async () => {
    const plans = await dummyFetch();
    setPlansOfAction(plans);
    console.log("fetched");
  }, []);

  const updatePlanText = (
    planID: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setPlansOfAction((oldPlans) => {
      if (oldPlans && oldPlans !== "denied")
        return oldPlans.map((checkPlan) =>
          checkPlan.id === planID
            ? { ...checkPlan, title: event.target.value }
            : checkPlan
        );
      else return oldPlans;
    });

    setUnsavedChanges(true);
  };

  function addNewPlan() {
    setPlansOfAction((oldPlans) => {
      if (!oldPlans || oldPlans === "denied") return oldPlans;

      return [
        ...oldPlans,
        {
          id: tempId.toString(),
          title: "New Plan of Action",
          status: "active",
          clientOnly: true,
        },
      ];
    });

    // increment the client side id
    setTempId((id) => id + 1);

    setUnsavedChanges(true);
  }

  async function save() {
    if (plansOfAction && plansOfAction !== "denied") {
      const newPlans = plansOfAction
        .filter((plan) => plan.clientOnly)
        .map((plan) => ({ id: plan.id, status: plan.status }));

      const existingPlans = plansOfAction.filter((plan) => !plan.clientOnly);

      // disable when plans are sent
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const plans = {
        new: newPlans,
        existing: existingPlans,
      };

      // send this off to the backend

      setUnsavedChanges(false);
    }
  }

  function reorderList(movedPlan: PlanOfAction) {
    if (plansOfAction && plansOfAction !== "denied") {
      const sorted = plansOfAction
        .map<[number, PlanOfAction]>((plan, index) => {
          const div = childRefs.current[index];

          return [div?.getBoundingClientRect().top ?? 0, plan];
        })
        .sort((a, b) => a[0] - b[0]);

      // now need to find out whether to change category
      // check whether the box is above completed text
      const movedPlanBox = plansOfAction
        .map((plan, index) => {
          if (plan === movedPlan) {
            const div = childRefs.current[index];

            return div?.getBoundingClientRect();
          }

          return null;
        })
        .find((maybeBox) => !!maybeBox);

      const dividerBox = completedRef.current?.getBoundingClientRect();

      if (dividerBox && movedPlanBox) {
        // this will only move up if the item is fully clear of the divider
        if (movedPlanBox.bottom < dividerBox.top) {
          movedPlan.status = "active";
        }
        // same for moving down
        if (movedPlanBox.top > dividerBox.bottom) {
          movedPlan.status = "completed";
        }

        // means that when placed on the divider, nothing will happen
      }

      const plans = sorted.map((height) => height[1]);

      // delete all to force a redraw
      // this resets the moving on ALL
      // setPlansOfAction([]);

      setPlansOfAction(plans);
    }
  }

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return (
    <MainLayout title={"Set Plans of Action"}>
      <div className={styles.EditPlansOfAction} data-testid="EditPlansOfAction">
        {searchParams.has("mentee") ? (
          // if plans have loaded
          plansOfAction &&
          // if request failed
          (plansOfAction === "denied" ? (
            <div>
              <p>You don't have access to view this mentee's Plans of Action</p>
              <Button buttonStyle={"primary"} href={"/dashboard"}>
                Back
              </Button>
            </div>
          ) : (
            // else if successfully retrieved
            <div>
              <Button onClick={addNewPlan}>Add New Plan</Button>
              {/* yes, there is some code duplication here */}
              {/* however if I try to extract the list to a component it stops keeping focus on input box when i type */}
              <Title text={"Active"} />
              {activePlans &&
                activePlans.map((plan) => (
                  <Draggable
                    key={plan.id}
                    nodeRef={ref}
                    axis={"y"}
                    position={
                      currentDragged === plan.id ? undefined : { x: 0, y: 0 }
                    }
                    onStart={() => setCurrentDragged(plan.id)}
                    onStop={() => {
                      setCurrentDragged(undefined);
                      reorderList(plan);
                    }}
                  >
                    <div
                      ref={ref}
                      className={`${
                        plan.id === currentDragged && styles.selectedplanwrapper
                      }`}
                    >
                      <div
                        ref={(el) => {
                          if (el && plansOfAction)
                            childRefs.current[plansOfAction.indexOf(plan)] = el;
                        }}
                        className={`${styles.plan} ${
                          plan.id === currentDragged && styles.selectedplan
                        }`}
                      >
                        <div className={styles.plantext}>
                          <Icon className={styles.icon} icon={"📈"} />
                          <input
                            type="text"
                            defaultValue={plan.title}
                            onChange={updatePlanText.bind(undefined, plan.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </Draggable>
                ))}
              {activePlans && activePlans.length === 0 && <p>None</p>}
              <div ref={completedRef}>
                <Title text={"Completed"} />
              </div>
              {completedPlans &&
                completedPlans.map((plan) => (
                  <Draggable
                    key={plan.id}
                    nodeRef={ref}
                    axis={"y"}
                    onStart={() => setCurrentDragged(plan.id)}
                    position={
                      currentDragged === plan.id ? undefined : { x: 0, y: 0 }
                    }
                    onStop={() => {
                      setCurrentDragged(undefined);
                      reorderList(plan);
                    }}
                  >
                    <div
                      ref={ref}
                      className={`${
                        plan.id === currentDragged && styles.selectedplanwrapper
                      }`}
                    >
                      <div
                        ref={(el) => {
                          if (el && plansOfAction)
                            childRefs.current[plansOfAction.indexOf(plan)] = el;
                        }}
                        className={`${styles.plan} ${
                          plan.id === currentDragged && styles.selectedplan
                        }`}
                      >
                        <div className={styles.plantext}>
                          <Icon className={styles.icon} icon={"🏆"} />
                          <input
                            type="text"
                            defaultValue={plan.title}
                            onChange={updatePlanText.bind(undefined, plan.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </Draggable>
                ))}
              {completedPlans && completedPlans.length === 0 && <p>None</p>}
              <Button
                buttonStyle={unsavedChanges ? "primary" : "default"}
                onClick={save}
              >
                Save
              </Button>
            </div>
          ))
        ) : (
          <div>
            <p>No mentee specified.</p>
            <Button buttonStyle={"primary"} href={"/dashboard"}>
              Back
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default EditPlansOfAction;
