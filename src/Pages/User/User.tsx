import UserDetailView from "../../Components/User/UserDetailView";
import { useSelector } from "react-redux";
import { RootState } from "../../ReduxToolkit/Store"; // Adjust path



  export default function User() {
    const userId = useSelector((state: RootState) => state.auth.user?.user_id);
    console.log(userId);
    
     return (
       <div>
          <h1>User Page</h1>
            <UserDetailView userId={userId || ''} />
       </div>
     );
  }
