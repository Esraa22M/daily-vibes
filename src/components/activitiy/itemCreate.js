import { ModalComponent } from "../../modal/modal";
import { FlowText } from "./overrides";
export const ItemCreate = () => {
	return (
		<ModalComponent visible={true} animationType={"fade"}>
			<FlowText>Hi There </FlowText>
		</ModalComponent>


	);
};
