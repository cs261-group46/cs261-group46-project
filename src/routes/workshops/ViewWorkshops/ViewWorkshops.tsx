import React, {FC, useCallback, useEffect, useState} from 'react';
import styles from './ViewWorkshops.module.scss';
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import Title from '../../../components/UI/Title/Title';
import Button from "../../../components/UI/Button/Button";
import PageStepper from "../../../components/UI/PageStepper/PageStepper";

interface ViewWorkshopsProps {}

interface Workshop {
    id: string;
    host: string;
    title: string;
    date: Date;
    roomName: string;
    duration: number;
    capacity: number;
    signups: number;
    type: "workshop" | "group_session"
}

const ViewWorkshops: FC<ViewWorkshopsProps> = () => {
    const [workshops, setWorkshops] = useState<Workshop[]>();
    const pageSize = 3;
    const [page, setPage] = useState(0);
    const hasPages = (workshops?.length ?? 0) > 0;
    const pageAmount = Math.ceil((workshops?.length ?? 0) / pageSize) ;
    console.log(pageAmount)
    const workshopsOnPage: Workshop[] = workshops?.slice(page * pageSize, (page + 1) * pageSize) ?? [];

    async function dummyRequest(): Promise<Workshop[]> {
        // some code to feign an API request taking 500ms & returning the below object
        return new Promise(resolve => setTimeout(() => resolve([
            {
                id: "1",
                host: "me",
                title: "Introduction to Python",
                date: new Date(),
                roomName: "CS0.01",
                duration: 120,
                capacity: 10,
                signups: 2,
                type: "workshop",
            },
            {
                id: "2",
                host: "somebody else",
                title: "Introduction to C++",
                date: new Date(),
                roomName: "CS0.04",
                duration: 5,
                capacity: 100,
                signups: 80,
                type: "group_session",
            },
            {
                id: "3",
                host: "me",
                title: "Introduction to Python II",
                date: new Date(),
                roomName: "CS0.01",
                duration: 120,
                capacity: 10,
                signups: 2,
                type: "workshop",
            },
            {
                id: "4",
                host: "somebody else",
                title: "Introduction to C++ II",
                date: new Date(),
                roomName: "CS0.04",
                duration: 5,
                capacity: 100,
                signups: 80,
                type: "workshop",
            },
            {
                id: "5",
                host: "somebody else",
                title: "Introduction to C++ III",
                date: new Date(),
                roomName: "CS0.04",
                duration: 5,
                capacity: 100,
                signups: 80,
                type: "workshop",
            }
        ]), 500));
    }

    const fetchWorkshops = useCallback(async () => {
        const fetchedWorkshops = await dummyRequest();
        setWorkshops(fetchedWorkshops);
    }, [setWorkshops])

    useEffect(() => {
        fetchWorkshops();
    }, [fetchWorkshops]);

    return <MainLayout title={"Workshops"}>
        <div className={styles.ViewWorkshops} data-testid="ViewWorkshops">
            {workshops ? // if workshops truthy
                <div>
                    {workshopsOnPage.map(workshop =>
                        <div key={workshop.id} className={styles.workshop}>
                            <div>
                                <Title text={workshop.title}/>
                                <p>Host: {workshop.host}</p>
                                <p>{workshop.date.toUTCString()}</p>
                                <p>{workshop.duration} mins</p>
                                <p>{workshop.roomName}</p>
                                <p>{workshop.capacity - workshop.signups} / {workshop.capacity} slots left</p>
                            </div>
                            <Button href={`/workshops/${workshop.id}`}>See More...</Button>
                        </div>
                    )}
                </div>
                : // else not loaded yet
                <p>Loading workshops...</p>
            }
            {hasPages && <div className={styles.pagecontainer}>
                <PageStepper page={page} setPage={newPage => {
                    setPage(newPage);
                    window.scrollTo(0,0);
                }} maxPages={pageAmount}/>
            </div>}
        </div>
    </MainLayout>
}

export default ViewWorkshops;
