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
    room_name: string;
    duration: number;
    capacity: number;
    signups: number;
    type: "workshop" | "group_session"
    headline: string;
    description: string;
}

const ViewWorkshops: FC<ViewWorkshopsProps> = () => {
    const [workshops, setWorkshops] = useState<Workshop[]>();
    const pageSize = 3;
    const [page, setPage] = useState(0);
    const hasPages = (workshops?.length ?? 0) > 0;
    const pageAmount = Math.ceil((workshops?.length ?? 0) / pageSize) ;
    const workshopsOnPage: Workshop[] = workshops?.slice(page * pageSize, (page + 1) * pageSize) ?? [];
    const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop>();

    function getDateString(date: Date, duration: number) {
        let start = date;
        let end = new Date(new Date(start).setTime(start.getTime() + (duration * 60 * 1000)));

        return `${start.toDateString()}
                ${start.getUTCHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")} | 
                ${end.getUTCHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`
    }

    async function dummyRequest(): Promise<Workshop[]> {
        // some code to feign an API request taking 500ms & returning the below object
        return new Promise(resolve => setTimeout(() => resolve([
            {
                id: "1",
                host: "me",
                title: "Introduction to Python",
                date: new Date(),
                room_name: "CS0.01",
                duration: 120,
                capacity: 10,
                signups: 2,
                type: "workshop",
                headline: "Learn python in 5 minutes",
                description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus!",
            },
            {
                id: "2",
                host: "somebody else",
                title: "Introduction to C++",
                date: new Date(),
                room_name: "CS0.04",
                duration: 5,
                capacity: 100,
                signups: 80,
                type: "group_session",
                headline: "Learn c++ in 5 minutes",
                description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus!",
            },
            {
                id: "3",
                host: "me",
                title: "Introduction to Python II",
                date: new Date(),
                room_name: "CS0.01",
                duration: 120,
                capacity: 10,
                signups: 2,
                type: "workshop",
                headline: "Learn python in 10 minutes",
                description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus!",
            },
            {
                id: "4",
                host: "somebody else",
                title: "Introduction to C++ II",
                date: new Date(),
                room_name: "CS0.04",
                duration: 5,
                capacity: 100,
                signups: 80,
                type: "workshop",
                headline: "Learn c++ in 10 minutes",
                description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus!",
            },
            {
                id: "5",
                host: "somebody else",
                title: "Introduction to C++ III",
                date: new Date(),
                room_name: "CS0.04",
                duration: 5,
                capacity: 100,
                signups: 80,
                type: "workshop",
                headline: "Learn c++ in 15 minutes",
                description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus!",
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
                    {workshopsOnPage.map(workshop => {
                        return <div key={workshop.id} className={styles.workshop}>
                                <div>
                                    <Title text={workshop.title}/>
                                    <Title text={workshop.headline}/>
                                    <p>Host: {workshop.host}</p>
                                    <p>{getDateString(workshop.date, workshop.duration)}</p>
                                    <p>{workshop.room_name}</p>
                                    <p>{workshop.capacity - workshop.signups} / {workshop.capacity} slots left</p>
                                </div>
                                <Button onClick={() => setSelectedWorkshop(workshop)}>See More...</Button>
                            </div>;
                        }
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
            <div className={`${styles.selectedworkshop} ${selectedWorkshop ? styles.visible : styles.invisible}`}>
                {/* must make sure contents are included when selected is undefined (even if its invisible) */}
                {selectedWorkshop && <div className={styles.workshopcard}>
                    <div className={styles.header}>
                        <Title text={selectedWorkshop.title}/>
                        <Title text={selectedWorkshop.headline}/>
                        <p>Host: {selectedWorkshop.host}</p>
                        <p>{getDateString(selectedWorkshop.date, selectedWorkshop.duration)}</p>
                        <p>{selectedWorkshop.room_name}</p>
                        <p>{selectedWorkshop.capacity - selectedWorkshop.signups} / {selectedWorkshop.capacity} slots left</p>
                    </div>
                    <p className={styles.description}>{selectedWorkshop.description}</p>
                    <div className={styles.footer}>
                        <Button buttonStyle={"primary"} icon={"📅"} onClick={() => setSelectedWorkshop(undefined)}>Sign Up</Button>
                    </div>

                    {/* TODO: create an 'x' button component */}
                    <img className={styles.x} src={""} alt={"close"} width={25} height={25} onClick={() => setSelectedWorkshop(undefined)}/>
                </div>}
            </div>
        </div>
    </MainLayout>
}

export default ViewWorkshops;
