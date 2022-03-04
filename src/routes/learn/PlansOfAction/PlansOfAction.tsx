import React, {FC, useCallback, useEffect, useState} from 'react';
import styles from './PlansOfAction.module.scss';
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import Title from "../../../components/UI/Title/Title";
import Icon from "../../../components/UI/Icon/Icon";
import PieView from "../../../components/UI/PieView/PieView";

interface PlansOfActionProps {}

const PlansOfAction: FC<PlansOfActionProps> = () => {
    const [plansOfAction, setPlansOfAction] = useState<PlanOfAction[]>([]);
    const activePlans = plansOfAction.filter(plan => plan.status === "active");
    const completedPlans = plansOfAction.filter(plan => plan.status === "completed");

    async function dummyFetch(): Promise<PlanOfAction[]> {
        return new Promise(resolve => setTimeout(() => resolve([
            {
                id: "1",
                title: "complete this page",
                status: "active"
            },
            {
                id: "2",
                title: "what ARE hooks, really?",
                status: "active"
            },
            {
                id: "3",
                title: "pick a layout",
                status: "completed"
            },
            {
                id: "4",
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

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans])

    return <MainLayout title={"Plans of Action"}><div className={styles.PlansOfAction} data-testid="PlansOfAction">
        <div className={styles.stats}>
            <PieView segments={[
                {label: "Active", fill: "#393838", fr: activePlans.length},
                {label: "Completed", fill: "#07A417", fr: completedPlans.length}
            ]}/>
        </div>
        <Title text={"Active"}/>
        {activePlans.map(plan => <div key={plan.id} className={styles.plan}>
            <Icon className={styles.icon} icon={"📈"}/>
            <p>{plan.title}</p>
        </div>)}
        <Title text={"Completed"}/>
        {completedPlans.map(plan => <div key={plan.id} className={styles.plan}>
            <Icon className={styles.icon} icon={"🏆"}/>
            <p>{plan.title}</p>
        </div>)}

    </div></MainLayout>
}

export default PlansOfAction;
