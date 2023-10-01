import UserProfile from '../components/profile/user-profile';
import { getSession } from 'next-auth/react';

function ProfilePage() {
  return <UserProfile />;
}

export async function getServerSideProps(context) {
  //getSession() can be used on server-side also
  const session = await getSession({ req: context.req });

  if (!session) {
    //if no session, then redirect to auth page
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      }
    }
  }

  return {
    props: { session },
  }
}

export default ProfilePage;
