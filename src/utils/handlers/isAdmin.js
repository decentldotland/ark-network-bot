export async function isSuperUser(usersList, username) {
  const user = usersList.filter((usr) => usr["user"]["username"] === username);
  console.log(user)
  const admin = user[user.length - 1];

  if (!["creator", "administrator"].includes(admin?.status)) {
    return {status: false, admin_profile: undefined};
  }

  return {status: true, admin_profile: admin};;
}
