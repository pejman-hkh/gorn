import React, { useContext, useEffect, useRef, useState } from "react";
import { useGoTo, useRouterUpdateDataContext } from "../router/router";
import { DataContext } from "../router/data";
import ReactSelect from 'react-select';
import Api from "../router/api"
import { useTranslation } from "react-i18next";
import { Editor as DraftEditor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js';

export function Alert({ children, ...props }: any) {

	let className: string = "hidden"


	if (props.type == "danger") {
		className = ('alert p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400')
	} else if (props.type == "success") {
		className = ('alert p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400')
	} else if (props.type == "hidden") {
		className = ("hidden")
	}

	return <div className={props?.alertclass + " " + className} ref={props?.fref} role="alert">{children}</div>
}

export function Label({ children, ...props }: any) {
	return <label htmlFor={props.htmlFor} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{children}</label>
}

export function Upload({ ...props }) {
	return <><label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor={props.id}>{props.title}</label>
		<input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" {...props} type="file" />
	</>
}
export function Editor({ ...props }) {
	const [editorState, setEditorState] = useState<any>(null)

	useEffect(() => {
		if (props?.defaultValue) {
			const blocksFromHTML: any = convertFromHTML(props?.defaultValue)
			const content = ContentState.createFromBlockArray(blocksFromHTML)
			setEditorState(EditorState.createWithContent(content))
		}
	}, [props?.defaultValue])

	const stateChange = (editorState: any) => {
		setEditorState(editorState)
	}
	if (props?.noeditor) {
		return <><Label htmlFor={props?.id}>{props.title}</Label>
			<Textarea name={props?.name}></Textarea>
		</>
	}

	return <><Label htmlFor={props?.id}>{props.title}</Label><DraftEditor
		editorState={editorState}
		onEditorStateChange={stateChange}
	/><textarea className="hidden" name={props?.name} value={editorState ? draftToHtml(convertToRaw(editorState?.getCurrentContent() || "")) : ""}></textarea></>;
}

export function SelectSearch({ children, ...props }: any) {

	const [list, setList] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(false)
	let selected: any
	let setSelected: any
	if (props?.select) {
		[selected, setSelected] = props?.select
	} else {
		[selected, setSelected] = useState({})
	}

	let sendRequest = false
	let timeOut: number;

	const getDefaultList = (childs: any) => {
		let list: any[] = []
		childs.map((item: any, i: number) => {
			if (item?.props) {
				list.push({ value: item?.props?.value, label: item?.props?.children })
				if (props?.defaultValue == item?.props?.value) {
					setSelected({ value: item?.props?.value, label: item?.props?.children })
				} else {
					if (i == 0)
						setSelected({ value: item?.props?.value, label: item?.props?.children })
				}
			}
		})
		return list
	}
	const InputHandler = (inputValue: any) => {
		if (!inputValue || inputValue == "" || !props?.path ) {
			return
		}
		
		const childs: any[] = React.Children.toArray(children)
		let list: any[] = getDefaultList(childs)
		if (!sendRequest) {
			clearTimeout(timeOut);
			setIsLoading(true)
			timeOut = setTimeout(function () {
				sendRequest = true;
				const path = props.path.match(/\?/) ? props.path + "&" : props.path + "?";
				Api(path + "nopage=true&search=" + encodeURIComponent(inputValue)).then((data: any) => {
				
					data?.data?.list.map((item: any) => {
						list.push({ value: item.id, label: item.title })
					})
					setList(list)
					setIsLoading(false)
				})
			}, 600);
		}
	}

	useEffect(() => {

		//if (props?.edit?.id || props?.default) {
		setIsLoading(true)
		const childs: any[] = React.Children.toArray(children)
		let list: any[] = getDefaultList(childs)
		if (props?.path) {
			let path = props.path.match(/\?/) ? props.path + "&" : props.path + "?";
			path += "nopage=true"

			Api( path ).then((data: any) => {
				data?.data?.list.map((item: any) => {
					list.push({ value: item.id, label: item.title })
					if (props?.defaultValue == item.id) {
						setSelected({ value: item.id, label: item.title })
					}
				})

				setList(list)
				setIsLoading(false)

			})
		} else {
			setList(list)
			setIsLoading(false)
		}

		//}
	}, [props.path])

	useEffect(() => {
		if (props?.onChange)
			props?.onChange(selected)
	}, [selected])
	const { t } = useTranslation()

	return <><Label htmlFor={props?.id}>{props.title}</Label><ReactSelect {...props}
		options={list}
		isLoading={isLoading}
		placeholder={t("Group")}
		onChange={(item: any) => {
			setSelected(item);
		}}
		onInputChange={InputHandler}
		value={selected}
		defaultValue={props?.defaultValue}
		styles={{ control: (styles) => ({ ...styles, borderColor: "#D1D5DB", backgroundColor: "#F9FAFB" }) }}
	/></>

}

export function Select({ children, ...props }: any) {
	const select = useRef<HTMLSelectElement>(null)
	useEffect(function () {
		if (props?.defaultValue)
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

export function Checkbox({ children, ...props }: any) {
	return <div className="flex items-center"><input {...props} type="checkbox" className={props.className + " w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"} />
		<label htmlFor={props.id} className="m-1">{children}</label></div>
}

const toJson = (f: any) => {
	let method = function (object: any, pair: any) {

		let keys = pair[0].replace(/\]/g, '').split('[');
		let key = keys[0];
		let value = pair[1];

		if (keys.length > 1) {

			let i, x, segment;
			let last = value;
			let type = isNaN(keys[1]) ? {} : [];

			value = segment = object[key] || type;

			for (i = 1; i < keys.length; i++) {

				x = keys[i];

				if (i == keys.length - 1) {
					if (Array.isArray(segment)) {
						segment.push(last);
					} else {
						segment[x] = last;
					}
				} else if (segment[x] == undefined) {
					segment[x] = isNaN(keys[i + 1]) ? {} : [];
				}

				segment = segment[x];

			}

		}

		object[key] = value;

		return object;

	}

	return JSON.stringify(Array.from(f).reduce(method, {}));
}

export default function Form({ children, ...props }: any) {
	const dataContext = useContext(DataContext) as any

	const baseUri = dataContext?.baseUri

	const [alertText, setAlertText] = useState(null)
	const [alertType, setAlertType] = useState('')

	const { i18n } = useTranslation();

	//let submitted = true;
	const alertElement = useRef(0);
	function submitHandler(e: any) {
		e.preventDefault();

		const dataForm = new FormData(e.target);
		dataForm.append("lang", i18n.language)
		// if (!submitted)
		// 	return;
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

		//submitted = false;

		let action = (props.action ? props.action : getPathName())

		if (action.substr(0, 1) != '/')
			action = '/' + action

		if (props.action)
			action = baseUri + action

		let fetchParam: any

		if (props?.method == "json") {

			fetchParam = {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: toJson(dataForm)
			}
		} else {
			fetchParam = {
				method: method,
				body: dataForm
			}
		}

		fetch(import.meta.env.VITE_API_URL + action + '?' + new URLSearchParams({ auth: localStorage.getItem('auth') } as any), fetchParam)
			.then(function (res) { return res.json(); })
			.then(function (fetchData) {
				if (fetchData.data?.auth)
					localStorage.setItem('auth', fetchData.data?.auth);

				//submitted = true;
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
					if (props?.success != null) {
						props.success()
					}
				}

				if (fetchData.data?.redirect) {
					useGoTo(fetchData.data?.redirect)
				}
			})
	}

	useEffect(() => {
		setAlertType("hidden")
	}, [props?.action])

	return <form ref={props.fref} {...props} className={props?.disableclass ? "" : (props?.className ? props?.className : " mt-8 space-y-6")} onSubmit={submitHandler}><Alert alertclass={props?.alertclass} fref={alertElement} type={alertType}>{alertText}</Alert>{children}</form>
}