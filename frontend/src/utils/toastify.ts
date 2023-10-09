import { ToastContainerProps } from 'react-toastify'

const basicToastContainerProps: ToastContainerProps = {
	position:'bottom-right',
	hideProgressBar:false,
	limit:5,
	autoClose:5000,
	pauseOnHover:true,
	closeOnClick:true,
	newestOnTop:true,
	theme:'dark'
}

export { basicToastContainerProps };