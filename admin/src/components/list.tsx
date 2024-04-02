import * as Breadcrumb from "./breadcrumb"
import * as Actions from "./actions"
import { handler } from "@tailwindcss/aspect-ratio"
import { useState } from "react"

export function Breadcrumbs({ children, ...props }) {
    return <Breadcrumb.Wrapper>
        <Breadcrumb.Main>
            <Breadcrumb.ItemHome></Breadcrumb.ItemHome>
            <Breadcrumb.Item to="/dashboard">Cms</Breadcrumb.Item>
            <Breadcrumb.Item to={props.link}>{props.title}</Breadcrumb.Item>
        </Breadcrumb.Main>
        <Breadcrumb.Title>All {props.title}s</Breadcrumb.Title>

        <Actions.Wrapper>
            <Actions.LeftSide>
                <Actions.SearchForm></Actions.SearchForm>
                <Actions.Tasks></Actions.Tasks>
            </Actions.LeftSide>

            <Actions.RightSide>
                <Actions.AddButton>Add {props.title}</Actions.AddButton>
                <Actions.ExportButton>Export</Actions.ExportButton>
            </Actions.RightSide>
        </Actions.Wrapper>
    </Breadcrumb.Wrapper>
}

export function Wrapper({ children, ...props }) {
    return <div className="flex flex-col">
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow">
                    {children}
                </div>
            </div>
        </div>
    </div>
}

export function Thead({ children, ...props }) {
    return <thead {...props} className="bg-gray-100 dark:bg-gray-700">
        {children}
    </thead>
}

export function Th({ children, ...props }) {
    return <th {...props} scope="col" class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
        {children}</th>
}

export function Tbody({ children, ...props }) {
    return <tbody {...props} className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">{children}</tbody>
}

export function Tr({ children, ...props }) {
    return <tr {...props} className="hover:bg-gray-100 dark:hover:bg-gray-700">{children}</tr>
}

export function ButtonEdit({ children, ...props }) {

    const handler = (e) => {
        props.onClick()
        let ddb = document.getElementById('edit-user-modal')
        ddb.classList.toggle('hidden')
        ddb.previousSibling.classList.toggle('hidden')
    }

    return <button {...props} onClick={handler} type="button" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>{children}</button>
}

export function ButtonDelete({ children, ...props }) {
    const handler = (e) => {
        props.onClick()
        let ddb = document.getElementById('delete-user-modal')
        ddb.classList.toggle('hidden')
        ddb.previousSibling.classList.toggle('hidden')
    }

    return <button type="button" onClick={handler} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        {children}
    </button>
}

export function Td({ children, ...props }) {
    return <td {...props} className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">{children}</td>
}
export function TdAction({ children, ...props }) {
    return <td className="p-4 space-x-2 whitespace-nowrap">{children}</td>
}
export function TdCheckbox({ children, ...props }) {
    return <td className="w-4 p-4">{children}</td>
}
export function Checkbox({ children, ...props }) {
    const handler = function(e) {
     
        document.querySelectorAll("[td-checkbox]").each(function() {
            if( this == e.target )
                return

            this.checked = !this.checked
        })
    }
    return <div className="flex items-center">
        <input onChange={handler} {...props} type="checkbox" className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
        <label htmlFor={props.id} className="sr-only">{children}</label>
    </div>
}

export function CheckboxTd({ children, ...props }) {
    function handler() {

    }
    return <Checkbox onChange={handler} td-checkbox="" {...props}>{children}</Checkbox>
}


export function TdTitle({ children, ...props }) {
    return <td {...props} className="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">{children}</td>
}

export function TdText({ children, ...props }) {
    return <td {...props} className="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">{children}</td>
}

export function ActiveBadge({ children, ...props }) {
    return <div {...props} className="flex items-center">
        <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2" />  Active
    </div>
}

export function Table({ children, ...props }) {
    return <Wrapper>
        <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
            {children}
        </table>
    </Wrapper>
}