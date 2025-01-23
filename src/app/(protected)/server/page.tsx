import { auth } from "@/auth"
import { UserInfo } from "@/components/user-info"
import { currentUser } from "@/lib/current-user"

export const dynamic = "force-dynamic"

const ServerPage = async () => {
  console.log("ServerPage: I called it")
  const session = await auth()
  if (!session?.user) {
    return null
  }
  const user = await currentUser(session.user.accessToken)

  return <UserInfo label="💻 Server component" user={user} />
}

export default ServerPage
