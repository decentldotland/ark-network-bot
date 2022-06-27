export async function userExistenceInGrp(ctx, group_id) {
  try {
    const existence = await ctx.telegram.getChatMember(
      group_id,
      ctx.message.chat.id
    );

    if (existence?.status === "left") {
    	return false;
    }
    
    return existence;
  } catch (error) {
    console.log(error);
    return false;
  }
}
