
import CompanyList from "../../Components/Company/CompanyList";
import TaskTable from "../../Components/Task/TaskTable";
import TaskReview from "../../Components/Task/manager/TaskReview";
import TopCriticalTasksCarousel from "../../Components/Task/TopCriticalTasksCarousel";

 export default function Home() {
  
   console.log("Home Page");
   
    return (
      <div>
         <h1>Home Page</h1>
         <CompanyList />
         <TopCriticalTasksCarousel />
          <TaskReview />
         <TaskTable />
         
      </div>
    );
 }