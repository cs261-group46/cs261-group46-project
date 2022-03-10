import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./EditPlansOfAction.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import Icon from "../../components/UI/Icon/Icon";
import Title from "../../components/UI/Title/Title";
import Draggable from "react-draggable";
import UseVerifyUser from "../../hooks/UseVerifyUser/UseVerifyUser";
import DashboardSubpageLayout from "../../layouts/MainLayout/DashboardSubpageLayout/DashboardSubpageLayout";
import { get, update } from "../../api/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner/LoadingSpinner";
import UseSystemMessage from "../../hooks/UseSystemMessage/UseSystemMessage";

interface EditPlansOfActionProps {}

const EditPlansOfAction: FC<EditPlansOfActionProps> = () => {
  const {
    userId = null,
    mentee_id = null,
    mentor_id = null,
  } = UseVerifyUser<{
    userId: number | null | undefined;
    mentee_id: number | null | undefined;
    mentor_id: number | null | undefined;
  }>({
    userDataPolicies: [
      {
        dataPoint: "mentee.id",
      },
      {
        dataPoint: "mentor.id",
      },
    ],
  });
  const showMessage = UseSystemMessage();

  const [validated, setValidated] = useState(false);
  const [plansLoaded, setPlansLoaded] = useState(false);
  let { menteeId } = useParams();
  const navigate = useNavigate();

  const validateRole = useCallback(async () => {
    if ((!mentee_id && !mentor_id) || menteeId === undefined) {
      showMessage("error", "You do not have permission to access this page.");
      return navigate("/dashboard");
    }
    if (mentee_id !== Number.parseInt(menteeId)) {
      try {
        const data = await get({
          resource: "mentees",
          entity: Number.parseInt(menteeId),
          args: {
            fields: ["mentor.id"],
          },
        });

        if (mentor_id !== data.mentee.mentor.id) {
          showMessage(
            "error",
            "You do not have permission to access this page."
          );

          return navigate("/dashboard");
        }
        setValidated(true);
      } catch (errors) {
        showMessage("error", errors);
      }
    } else {
      setValidated(true);
    }
  }, [menteeId, mentee_id, mentor_id, navigate, showMessage]);

  useEffect(() => {
    if (userId) {
      validateRole();
    }
  }, [userId, validateRole]);

  const [plansOfAction, setPlansOfAction] = useState<PlanOfAction[]>([]);
  const activePlans = plansOfAction.filter((plan) => plan.status === "active");
  const completedPlans = plansOfAction.filter(
    (plan) => plan.status === "completed"
  );

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [tempId, setTempId] = useState(0);

  const ref = useRef(null);
  const childRefs = useRef<HTMLDivElement[]>([]);
  const completedRef = useRef<HTMLDivElement>(null);
  const [currentDragged, setCurrentDragged] = useState<number>();

  const getPlans = useCallback(async () => {
    try {
      const data = await get({
        resource: "mentees",
        entity: Number.parseInt(menteeId as string),
        args: {
          fields: ["plans_of_action"],
        },
      });

      setPlansOfAction(data.mentee.plans_of_action);

      const greatestId =
        data.mentee.plans_of_action.length > 0
          ? Math.max.apply(
              Math,
              data.mentee.plans_of_action.map(function (plan: PlanOfAction) {
                return plan.id;
              })
            )
          : 0;

      setTempId(greatestId + 1);
      setPlansLoaded(true);
    } catch (errors) {
      showMessage("error", errors);
    }
  }, [menteeId, showMessage]);

  useEffect(() => {
    getPlans();
  }, [getPlans]);

  const updatePlanText = (
    planID: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setPlansOfAction((oldPlans) =>
      oldPlans.map((checkPlan) =>
        checkPlan.id === planID
          ? { ...checkPlan, title: event.target.value }
          : checkPlan
      )
    );
    setUnsavedChanges(true);
  };

  const addNewPlan = () => {
    setPlansOfAction((oldPlans) => {
      if (!oldPlans) return oldPlans;

      return [
        ...oldPlans,
        {
          id: tempId,
          title: "New Plan of Action",
          status: "active",
          clientOnly: true,
        },
      ];
    });

    // increment the client side id
    setTempId((id) => id + 1);

    setUnsavedChanges(true);
  };

  const savePlans = async () => {
    try {
      const requestBody = {
        plansofaction: plansOfAction.map((plan) => ({
          status: plan.status,
          title: plan.title,
        })),
      };
      await update({
        resource: "mentees",
        entity: Number.parseInt(menteeId as string),
        body: requestBody,
      });

      setUnsavedChanges(false);
      showMessage("success", "Plans of Action saved successfully.");
    } catch (errors) {
      showMessage("error", errors);
    }
  };

  function reorderList(movedPlan: PlanOfAction) {
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
        if (movedPlan.status === "completed") {
          movedPlan.status = "active";
          setUnsavedChanges(true);
        }
      }
      // same for moving down
      if (movedPlanBox.top > dividerBox.bottom) {
        if (movedPlan.status === "active") {
          movedPlan.status = "completed";
          setUnsavedChanges(true);
        }
      }

      // means that when placed on the divider, nothing will happen
    }

    const plans = sorted.map((height) => height[1]);

    // delete all to force a redraw
    // this resets the moving on ALL
    // setPlansOfAction([]);

    setPlansOfAction(plans);
  }

  const removePlan = (plan: PlanOfAction) => {
    setPlansOfAction((prevPlans) => prevPlans.filter((p) => p.id !== plan.id));
    setUnsavedChanges(true);
  };

  return (
    <DashboardSubpageLayout title={"Set Plans of Action"}>
      <div className={styles.EditPlansOfAction} data-testid="EditPlansOfAction">
        {
          // if plans have loaded
          validated && plansLoaded ? (
            // else if successfully retrieved
            <div>
              <Button onClick={addNewPlan}>Add New Plan</Button>
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
                    onStart={() => {
                      console.log("this click fires as well");
                      setCurrentDragged(plan.id);
                    }}
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
                            onMouseDown={(e) => e.stopPropagation()}
                            onChange={updatePlanText.bind(undefined, plan.id)}
                          />
                          <button
                            id="remove-button"
                            onMouseDown={(event) => {
                              event.stopPropagation();
                              removePlan(plan);
                            }}
                          >
                            X
                          </button>
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
                            onClick={(e) => e.preventDefault()}
                            defaultValue={plan.title}
                            onChange={updatePlanText.bind(undefined, plan.id)}
                          />
                          <button
                            id="remove-button"
                            onMouseDown={(event) => {
                              event.stopPropagation();
                              removePlan(plan);
                            }}
                          >
                            X
                          </button>
                        </div>
                      </div>
                    </div>
                  </Draggable>
                ))}
              {completedPlans && completedPlans.length === 0 && <p>None</p>}
              <Button
                buttonStyle={unsavedChanges ? "primary" : "default"}
                onClick={savePlans}
              >
                Save
              </Button>
            </div>
          ) : (
            <LoadingSpinner />
          )
        }
      </div>
    </DashboardSubpageLayout>
  );
};

export default EditPlansOfAction;
