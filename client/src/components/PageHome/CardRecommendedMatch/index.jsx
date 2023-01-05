import React, { useState } from 'react';
import ActionsPosts from '../ActionsPost';
import { useDispatch, useSelector } from 'react-redux';
import { invitationSendGroupAction } from '../../../redux/actions';
import Swal from 'sweetalert2';
import logoMatch from '../../../assets/coheteHenry.png';
function CardRecommendedMatch({ id, image, name }) {
	const dispatch = useDispatch();
	const [responseFront, setResponseFront] = useState('');
	const userInformation = useSelector((state) => state.userInformation);

	const handleSendInvitationGroup = () => {
		if (!responseFront.length) {
			dispatch(
				invitationSendGroupAction({
					groupId: id,
					userId: userInformation?._id,
				})
			).then((res) => {
				handleAlertInvitationGroup(res.payload.msg);
				setResponseFront(res.payload.msg);
			});
		} else {
			handleAlertInvitationGroup(responseFront);
		}
	};
	const handleAlertInvitationGroup = (title) => {
		const Toast = Swal.mixin({
			toast: true,
			position: 'top',
			iconColor: 'white',
			// showClass: {
			//   popup: "animate__animated animate__fadeInDown",
			// },
			// hideClass: {
			//   popup: "animate__animated animate__fadeOutUp",
			// },
			// customClass: {
			//   popup: styles.coloredSuccede,
			//   title: styles.titles,
			// },
			showConfirmButton: false,
			timer: 2000,
			timerProgressBar: true,
            background: "#1e1c1d",
            color: "#f4f4f4",
            iconColor: "#fcd34d"
		});
		Toast.fire({
			icon: `${title == "The invitation has already been sent." ? 'warning' : title === "Invitation sent." ? 'succes' : 'warning'}`,
			title,
		});
	};
	return (
		<div className="flex items-center gap-5 text-white w-full ml-5 my-4">
			<img
				onClick={handleSendInvitationGroup}
				src={logoMatch}
				alt="match"
				className={`w-8 h-8 cursor-pointer self-end transition-all duration:100 hover:grayscale`} 
			/>
			<img src={image} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
			<h1>{name}</h1>
		</div>
	);
}

export default CardRecommendedMatch;
