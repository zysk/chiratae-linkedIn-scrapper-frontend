import { Modal, Box } from "@mui/material";
import CustomButton from "./Button";
export const ConfirmModal = ({ ModalBox, onCancel, onConfirm,modalData }) => {
return (
<Modal
    open={ModalBox}
    onClose={() => onCancel() }
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
    <Box className="modal-box">
        <div
        className="modal-container"
        style={{ minWidth: "40vw", maxWidth: "50vw" }}
        >
        <div className="modal-header">
        <h5>{modalData.heading}</h5>
        <CustomButton
            isBtn
            btntype="button"
            iconName="ion-close-circled text-white"
            changeClass="border-0 bg-transparent rounded-circle modal-close"
            ClickEvent={(e) => {
            e.preventDefault();
            onCancel()
            }}
        />
        </div>
        <div className="modal-body">
            <p>{modalData.title}</p>
            <div className="d-flex justify-content-center">
            <span className="pe-3">
                <CustomButton
                isBtn
                btnName="Confirm"
                btntype="button"
                changeClass="mt-4 btn btn-1"
                ClickEvent={(e) => {
                    e.preventDefault();
                    onConfirm(modalData)
                }}
                />
            </span>
            <span>
                <CustomButton
                isBtn
                btnName="Cancel"
                btntype="button"
                changeClass="mt-4 btn btn-2"
                ClickEvent={(e) => {
                    e.preventDefault();
                    onCancel()
                }}
                />
            </span>
            </div>
        </div>
        </div>
    </Box>
    </Modal>)
        
}