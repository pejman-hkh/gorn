import { useContext, useEffect, useRef, useState } from "react";
import { useGoTo, useRouterUpdateDataContext } from "../router/router";
import { DataContext } from "../router/data";

export function Alert({ children, ...props }: any) {

	let className = 'hidden'

	if (props.type == "danger") {
		className = 'alert p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400'
	} else if (props.type == "success") {
		className = 'alert p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400'
	}

	if (props?.alertclass)
		className += ' ' + props.alertclass;

	return <div className={className} role="alert">{children}</div>
}

export function Label({ children, ...props }: any) {
	return <label htmlFor={props.htmlFor} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{children}</label>
}

export function Select({ children, ...props }: any) {
	const select = useRef<HTMLSelectElement>(null)
	useEffect(function () {
		select.current!.value = props?.defaultValue
	}, [props.value])
	return <><Label htmlFor={props.id}>{props.title}</Label><select ref={select} {...props} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
		{children}
	</select></>
}
export function Input({ children, ...props }: any) {
	return <><Label htmlFor={props.id}>{children}</Label>
		<input {...props} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder={children} /></>
}

export function Textarea({ children, ...props }: any) {

	return <><Label htmlFor={props.id}>{children}</Label>
		<textarea {...props} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" /></>
}

function getPathName() {
	let pathName = window.location.pathname

	if (pathName.substr(-1) != '/')
		pathName += '/'
	return pathName
}

export default function Form({ children, ...props }: any) {
	const dataContext = useContext(DataContext) as Array<any>
	const baseUri = dataContext[2]?.baseUri

	const [alertText, setAlertText] = useState(null)
	const [alertType, setAlertType] = useState('')

	let submitted = true;
	const alertElement = useRef(0);
	function submitHandler(e: any) {
		e.preventDefault();

		const dataForm = new FormData(e.target);
		if (!submitted)
			return;
		const method = props.method?.toLowerCase() ?? "post";
		if (method == "get") {
			let to = props.action + '?' + new URLSearchParams((dataForm as any) || {})
			if (props.action)
				to = baseUri + to

			history.pushState({}, "", to);
			return
		}
		let submit = e.target.querySelector("button[type='submit']");
		let submitHtml: string
		if (submit) {
			submitHtml = submit.innerHTML;
			submit.innerHTML = 'Loading ...';
		}

		submitted = false;

		let action = (props.action ? props.action : getPathName())

		if (action.substr(0, 1) != '/')
			action = '/' + action

		if (props.action)
			action = baseUri + action
		fetch(import.meta.env.VITE_API_URL + action + '?' + new URLSearchParams({ auth: localStorage.getItem('auth') } as any),
			{
				method: method,
				body: dataForm
			})
			.then(function (res) { return res.json(); })
			.then(function (fetchData) {
				if (fetchData.data?.auth)
					localStorage.setItem('auth', fetchData.data?.auth);

				submitted = true;
				if (fetchData.data?.redirect) window.location.href = fetchData.data.redirect;

				if (fetchData.status == 1)
					setAlertType('success')
				else
					setAlertType('danger')

				setAlertText(fetchData.msg)

				//window.scrollTo(0, alertElement.current?.getBoundingClientRect().top + window.scrollY - 100);
				if (submit)
					submit.innerHTML = (submitHtml);

				if (fetchData.status == 1) {
					useRouterUpdateDataContext()
					if (props?.onSuccess != null) {
						props.onSuccess()
					}
				}

				if (fetchData.data?.redirect) {
					useGoTo(fetchData.data?.redirect)
				}
			})
	}

	return <form ref={props.fref} {...props} className={props?.disableclass ? "" : (props?.className ? props?.className : " mt-8 space-y-6")} onSubmit={submitHandler}><Alert alertclass={props?.alertclass} ref={alertElement} type={alertType}>{alertText}</Alert>{children}</form>
}