import React, {FC, useCallback, useEffect, useState} from 'react';
import styles from './ViewWorkshops.module.scss';
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import Title from '../../../components/UI/Title/Title';
import Button from "../../../components/UI/Button/Button";

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
}

const ViewWorkshops: FC<ViewWorkshopsProps> = () => {
    const [workshops, setWorkshops] = useState<Workshop[]>();
    const pageSize = 3;
    const [page, setPage] = useState(0);
    const hasPages = (workshops?.length ?? 0) > 0;
    const pageAmount = Math.ceil((workshops?.length ?? 0) / pageSize) - 1;
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
            {hasPages && <div>
                {page > 0 && <Button onClick={() => setPage(page => page - 1)}>Last Page</Button>}
                {page < pageAmount && <Button onClick={() => setPage(page => page + 1)}>Next Page</Button>}
            </div>}
        </div>
    </MainLayout>
}

export default ViewWorkshops;
