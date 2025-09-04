import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google' ;

export default function GoogleOauth(){
     return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
         <GoogleLogin
        onSuccess={(credentialResponse) => {

            const googleToken = credentialResponse.credential;

          fetch("http://localhost:5000/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: googleToken })
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("✅ Backend response:", data);
              localStorage.setItem("token", data.token); // save our JWT
            });
        }}
        onError={() => console.log("❌ Login Failed")}
        render={({ onClick, disabled }) => (
        <button
          onClick={onClick}
          disabled={disabled}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          mmmm
        </button>)}
         />
        </GoogleOAuthProvider>

     )
}