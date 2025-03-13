
import { getWorkspacesByUserId } from '@/features/workspace/actions';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/actions';
import { Workspace } from '@/types/workspace';

export default  async function Home() {


  const response = await getCurrentUser();

  let workspaces:Workspace[]=[];

  if(response.data ){
     workspaces = await getWorkspacesByUserId(response.data.id);
  }
 

  if(workspaces.length===0){
    redirect('/workspaces/create')
  }
  else{
    redirect(`/workspaces/${workspaces[0].id}`)
  }

}
