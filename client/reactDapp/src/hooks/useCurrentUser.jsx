// Import necessary hooks from React.
import { useState, useEffect } from "react";
// Import the PassageUser class from the Passage authentication library
import { PassageUser } from '@passageidentity/passage-auth/passage-user';

/**
 * This custom hook uses Passage authentication to manage and return the current user's state.
 * It provides information on whether the user is loading, authorized, and their username (email or phone).
 */
export function useCurrentUser() {
    // State to hold the result of the authentication check
    const [result, setResult] = useState({
        isLoading: true,
        isAuthorized: false,
        username: '',
    });

    useEffect(() => {
        // Flag to determine if the effect cleanup function has been called to prevent setting state on an unmounted component
        let cancelRequest = false;
        
        // Create a new PassageUser instance and call userInfo to fetch the current user's info
        new PassageUser().userInfo().then(userInfo=> {
            // If the component is unmounted, exit early to avoid setting state
            if( cancelRequest ) {
                return;
            }
             // If userInfo is undefined, it means the user is not authorized or not present
            if(userInfo === undefined){
                setResult({
                    isLoading: false,
                    isAuthorized: false,
                    username: "",
                });
                return;
            }
            // If userInfo exists, update state with the user's information
            setResult({
                isLoading: false,
                isAuthorized: true, 
                username: userInfo.email ? userInfo.email : userInfo.phone, 
            });
        });

        // Cleanup function to set the cancelRequest flag to true when the component unmounts
        return () => {
            cancelRequest = true;
        };
    }, []); // Empty dependency array means this effect runs once on mount
    
    // Return the current user's state to the component that uses this hook
    return result;
}