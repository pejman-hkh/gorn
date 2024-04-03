import { useEffect, useRef, useState } from "react";
import { useRouterUpdateDataContext } from "../router/router";

export function Alert({ children, ...props }) {
	var className = 'hidden'
	if (props.type == "danger") {
		className = 'alert m-4 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400'
	} else if (props.type == "success") {
		className = 'alert m-4 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400'
	}
	return <div className={className} role="alert">{children}</div>
}

export function Label({children, ...props}) {
	return <label htmlFor={props.htmlFor} class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{children}</label>
}

export function Select({ children, ...props }) {
	const select = useRef(0)
	useEffect(function() {
		select.current.value = props.defaultValue
	}, [props.value])
	return <><Label htmlFor={props.id}>{props.title}</Label><select ref={select} {...props} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
		{children}
	</select></>
}
export function Input({ children, ...props }) {
	return <><Label htmlFor={props.id}>{children}</Label>
		<input {...props} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder={children} /></>
}

export function Textarea({ children, ...props }) {

	return <><Label htmlFor={props.id}>{children}</Label>
		<textarea {...props} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" /></>
}

export default function Form({ children, ...props }) {
	const [alertText, setAlertText] = useState(null)
	const [alertType, setAlertType] = useState('')

	//const [data, setData] = useContext(DataContext);

	let submitted = true;
	const alertElement = useRef(0);
	function submitHandler(e) {
		e.preventDefault();
		const dataForm = new FormData(e.target);
		if (!submitted)
		return;

		if( props.method?.toLowerCase() == "get" ) {
			let to = props.action+'?'+new URLSearchParams(dataForm)
			
			history.pushState({}, "", to);
			return
		}
		let submit = e.target.querySelector("button[type='submit']");

		const submitHtml = submit.innerHTML;

		submit.innerHTML = 'Loading ...';

		submitted = false;
		let action = (props.action ? props.action : window.location.pathname)
		if( action.substr(0,1) != '/')
			action = '/'+action
		
		fetch(apiUrl + action + '?'+new URLSearchParams({ auth : localStorage.getItem('auth') }),
			{
				method: "POST",
				body: dataForm
			})
			.then(function (res) { return res.json(); })
			.then(function (fetchData) {
				if( fetchData.data?.auth)
					localStorage.setItem('auth', fetchData.data?.auth);

				submitted = true;
				if (fetchData.data?.redirect) window.location.href = fetchData.data.redirect;

				if (fetchData.status == 1)
					setAlertType('success')
				else
					setAlertType('danger')
				
				setAlertText(fetchData.msg)
		
				//window.scrollTo(0, alertElement.current?.getBoundingClientRect().top + window.scrollY - 100);
				submit.innerHTML = (submitHtml);

				if(fetchData.status == 1) {
					useRouterUpdateDataContext()
					if( props?.onSuccess != null ) {
						props.onSuccess()
					}

				}
			})
	}

	return <form {...props} className="mt-8 space-y-6" onSubmit={submitHandler}><Alert ref={alertElement} type={alertType}>{alertText}</Alert>{children}</form>
}