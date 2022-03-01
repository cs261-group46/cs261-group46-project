import React, {ChangeEvent, FC, useCallback, useEffect, useState} from 'react';
import styles from './EditPlansOfAction.module.scss';
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import { useSearchParams } from 'react-router-dom';
import Button from "../../../components/UI/Button/Button";
import Icon from "../../../components/UI/Icon/Icon";
import Title from "../../../components/UI/Title/Title";

interface EditPlansOfActionProps {}

const EditPlansOfAction: FC<EditPlansOfActionProps> = () => {
    const [tempId, setTempId] = useState(0);
    const [plansOfAction, setPlansOfAction] = useState<PlanOfAction[] | "denied">();
    const [searchParams] = useSearchParams();
    const activePlans = plansOfAction !== "denied" ? plansOfAction?.filter(plan => plan.status === "active") : undefined;
    const completedPlans = plansOfAction !== "denied" ? plansOfAction?.filter(plan => plan.status === "completed") : undefined;
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    async function dummyFetch(): Promise<PlanOfAction[] | "denied"> {
        return new Promise(resolve => setTimeout(() => resolve([
            {
                id: "#1",
                title: "complete this page",
                status: "active"
            },
            {
                id: "#2",
                title: "what ARE hooks, really?",
                status: "active"
            },
            {
                id: "#3",
                title: "pick a layout",
                status: "completed"
            },
            {
                id: "#4",
                title: "no sql",
                status: "completed"
            },
        ]), 500))
    }

    const fetchPlans = useCallback(async () => {
        const plans = await dummyFetch();
        setPlansOfAction(plans);
        console.log("fetched")
    }, []);

    const updatePlanType = (planID: string, event: ChangeEvent<HTMLSelectElement>) => {
        if (plansOfAction && plansOfAction !== "denied") {
            let thisPlan = plansOfAction.filter(plan => plan.id === planID)[0];

            setPlansOfAction([
                // remove this from the current plans
                ...plansOfAction.filter(plan => plan.id !== planID),

                // to append to the end
                { ...thisPlan, status: event.target.value as "active" | "completed" }

                // this makes it appear at the end of the list it was moved to
            ]);
        }

        setUnsavedChanges(true);
    }

    const updatePlanText = (planID: string, event: ChangeEvent<HTMLInputElement>) => {

        setPlansOfAction(oldPlans => {
            if (oldPlans && oldPlans !== "denied")
                return oldPlans.map(
                    checkPlan => checkPlan.id === planID ? { ...checkPlan, title: event.target.value } : checkPlan
                )
            else return oldPlans;
        })

        setUnsavedChanges(true);
    }

    function addNewPlan() {
        setPlansOfAction(oldPlans => {
            if (!oldPlans || oldPlans === "denied") return oldPlans

            return [...oldPlans, { id: tempId.toString(), title: "New Plan of Action", status: "active", clientOnly: true }];
        });

        // increment the client side id
        setTempId(id => id + 1);

        setUnsavedChanges(true);
    }

    async function save() {
        if (plansOfAction && plansOfAction !== "denied") {
            const newPlans = plansOfAction
                .filter(plan => plan.clientOnly)
                .map(plan => ({ id: plan.id, status: plan.status }));

            const existingPlans = plansOfAction.filter(plan => !plan.clientOnly);

            const plans = {
                new: newPlans, existing: existingPlans
            }

            // send this off to the backend

            setUnsavedChanges(false);
        }
    }

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans])

    return <MainLayout title={"Set Plans of Action"}>
        <div className={styles.EditPlansOfAction} data-testid="EditPlansOfAction">
            {searchParams.has("mentee")
                ? (
                    // if plans have loaded
                    plansOfAction && (
                        // if request failed
                        plansOfAction === "denied"
                        ?
                            <div>
                                <p>You don't have access to view this mentee's Plans of Action</p>
                                <Button buttonStyle={"primary"} href={"/dashboard"}>Back</Button>
                            </div>
                        // else if successfully retrieved
                        :
                            <div>
                                <Button onClick={addNewPlan}>Add New Plan</Button>

                                {/* yes, there is some code duplication here */}
                                {/* however if I try to extract the list to a component it stops keeping focus on input box when i type */}
                                <Title text={"Active"}/>
                                { activePlans && (
                                activePlans.map(plan => <div key={plan.id} className={styles.plan}>
                                    <div className={styles.plantext}>
                                    <Icon className={styles.icon} icon={"📈"}/>
                                    <input type="text" defaultValue={plan.title} onChange={updatePlanText.bind(undefined, plan.id)}/>
                                    </div>
                                    <select defaultValue={plan.status} onChange={updatePlanType.bind(undefined, plan.id)}>
                                    <option value={"active"}>Active</option>
                                    <option value={"completed"}>Completed</option>
                                    </select>
                                    </div>)
                                )}
                                <Title text={"Completed"}/>
                                { completedPlans && (
                                    completedPlans.map(plan => <div key={plan.id} className={styles.plan}>
                                        <div className={styles.plantext}>
                                            <Icon className={styles.icon} icon={"🏆"}/>
                                            <input type="text" defaultValue={plan.title} onChange={updatePlanText.bind(undefined, plan.id)}/>
                                        </div>
                                        <select defaultValue={plan.status} onChange={updatePlanType.bind(undefined, plan.id)}>
                                            <option value={"active"}>Active</option>
                                            <option value={"completed"}>Completed</option>
                                        </select>
                                    </div>)
                                )}
                                <Button buttonStyle={unsavedChanges ? "primary" : "default"} onClick={save}>Save</Button>
                            </div>
                    )
                )
                : <div>
                    <p>No mentee specified.</p>
                    <Button buttonStyle={"primary"} href={"/dashboard"}>Back</Button>
                </div>}
        </div>
    </MainLayout>
}

export default EditPlansOfAction;
