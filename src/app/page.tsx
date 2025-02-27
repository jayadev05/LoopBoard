
import { signOut, useSession } from 'next-auth/react';
import React from 'react'

export default  function Home() {

  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  
  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user?.name}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
