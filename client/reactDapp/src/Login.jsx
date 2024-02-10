// Import Passage authentication component for passwordless login
import "@passageidentity/passage-elements/passage-auth";

/**
 * The Login component integrates Passage for passwordless authentication.
 * It renders a Passage authentication element that handles user authentication
 * without traditional passwords, using biometrics or other methods instead.
 * The 'app-id' prop is specific to your Passage app, and it's used to identify
 * your application to the Passage authentication service.
 */
function Login() {
  return <passage-auth app-id="swni5tN408lF8CQAWVwxli4d"></passage-auth>;
}

export default Login;
