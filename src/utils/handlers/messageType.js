export async function getMessageType(message) {
	try {
		const type = message?.chat?.type;
		return type;
	} catch(error) {
		console.log(error);
	}
}