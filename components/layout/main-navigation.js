import Link from 'next/link';
import classes from './main-navigation.module.css';
import { useSession, signOut } from 'next-auth/react';

function MainNavigation() {

  // The useSession() React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.
  // Make sure that <SessionProvider> is added to pages/_app.js.
  const { data: session, status } = useSession()
  console.log("status = ", status);
  console.log("session = ", session);

  //using useSession(), this component will be updated automatically as soon as active session changes
  // and it will change when sign out
  function logoutHandler() {
    //cookie is cleared and information of active user is cleared
    signOut();
  }

  return (
    <header className={classes.header}>
      <Link href='/'>
        <a>
          <div className={classes.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          {!session && status != "loading" && (
            <li>
              <Link href='/auth'>Login</Link>
            </li>
          )}
          {session && (
            <li>
              <Link href='/profile'>Profile</Link>
            </li>
          )}
          {session && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
