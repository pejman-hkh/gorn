import Button from "./button"
import Form, { Textarea, Upload } from "./form"
import * as Modal from "./modal"
import * as Breadcrumb from "./breadcrumb"
import * as Actions from "./actions"
import * as Task from "./tasks"
import { useTranslation } from "react-i18next"
import { useGoTo } from "../router/router"
import * as Grid from "../components/grid"

export function Wrapper({ children, ...props }: any) {
    return <div {...props} className="flex flex-col">
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow">
                    {children}
                </div>
            </div>
        </div>
    </div>
}

export function Thead({ children, ...props }: any) {
    return <thead {...props} className="bg-gray-100 dark:bg-gray-700">
        {children}
    </thead>
}

export function Th({ children, ...props }: any) {
    return <th {...props} scope="col" className="p-4 text-sm font-medium ltr:text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
        {children}</th>
}

export function Tbody({ children, ...props }: any) {
    return <tbody {...props} className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">{children}</tbody>
}

export function Tr({ children, ...props }: any) {
    return <tr {...props} className="hover:bg-gray-100 dark:hover:bg-gray-700">{children}</tr>
}

export function Tooltip({ children, ...props }: any) {
    return <div {...props} role="tooltip"
        className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
        {children}
        <div className="tooltip-arrow" data-popper-arrow></div>
    </div>
}

export function ButtonEdit({ children, ...props }: any) {

    const { t } = useTranslation()
    const id = Math.random()
    return <><button data-tooltip-target={id} {...props} onClick={props?.onClick} type="button" className="rtl:ml-1 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>{children}</button>
        <Tooltip id={id}>{t("Edit")}</Tooltip>
    </>
}
export function ButtonFile({ children, ...props }: any) {

    const { t } = useTranslation()
    const id = Math.random()
    return <><button data-tooltip-target={id} {...props} onClick={props?.onClick} type="button" className="rtl:ml-1 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        <svg class="w-4 h-4 text-white transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"></path></svg>
        {children}</button>
        <Tooltip id={id}>{t("Attachment")}</Tooltip>
    </>
}

export function ButtonDelete({ children, ...props }: any) {
    const { t } = useTranslation()
    const id = 'delete' + Math.random()
    return <><button data-tooltip-target={id} {...props} type="button" className="rtl:ml-1 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        {children}
    </button>
        <Tooltip id={id}>{t("Delete")}</Tooltip>
    </>
}

export function Td({ children, ...props }: any) {
    return <td {...props} className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">{children}</td>
}
export function TdAction({ children, ...props }: any) {
    return <td {...props} className="p-4 space-x-2 whitespace-nowrap">{children}</td>
}
export function TdCheckbox({ children, ...props }: any) {
    return <td {...props} className="w-4 p-4">{children}</td>
}
export function Checkbox({ children, ...props }: any) {
    const handler = function (e: any) {

        document.querySelectorAll("[td-checkbox]")?.each(function (this: any) {
            if (this == e.target)
                return

            this.checked = e.target.checked
        })
    }
    return <div className="flex items-center">
        <input onChange={handler} {...props} type="checkbox" className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
        <label htmlFor={props.id} className="sr-only">{children}</label>
    </div>
}

export function CheckboxTd({ children, ...props }: any) {
    function handler() {

    }
    return <Checkbox onChange={handler} td-checkbox="" {...props}>{children}</Checkbox>
}


export function TdTitle({ children, ...props }: any) {
    return <td {...props} className="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap dark:text-white">{children}</td>
}

export function TdText({ children, ...props }: any) {
    return <td {...props} className="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">{children}</td>
}

export function ActiveBadge({ ...props }) {
    const { t } = useTranslation();
    let className = "h-2.5 w-2.5 rounded-full ltr:mr-2 rtl:ml-2"
    if (props.active == 1)
        className += ' bg-green-400'
    else
        className += ' bg-red-400'

    return <div {...props} className="flex items-center">
        <div className={className} />  {props.active ? t('Enable') : t('Disable')}
    </div>
}

export function Table({ children, ...props }: any) {
    return <Wrapper>
        <table {...props} className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
            {children}
        </table>
    </Wrapper>
}

export function BreadCrumb({ disableDeleteAll, disableAdd, ModuleBreadcrumb, title, route, setActionValue, deleteAllModal, addModal, setEdit, searchModal }: any) {
    const { t } = useTranslation();
    let sendRequest = false
    let timeOut: number;
    const searchHandler = (e: any) => {
        if (!sendRequest) {
            clearTimeout(timeOut);
            timeOut = setTimeout(function () {
                sendRequest = true;
                useGoTo("?search=" + encodeURIComponent(e.target.value))
            }, 800);
        }
    }
    const Add = disableAdd??<Actions.AddButton onClick={() => { addModal[1](true); setEdit({}) }}>{t("Add {{title}}", { title: t(title) })}</Actions.AddButton>
    const Module = ModuleBreadcrumb??<Breadcrumb.Item to="/dashboard">{t("Cms")}</Breadcrumb.Item>
    const DeleteAll = disableDeleteAll?"":<Task.Delete onClick={() => { setActionValue("delete"); deleteAllModal[1](true) }} />
    return <Breadcrumb.Wrapper>
        <Breadcrumb.Main>
            <Breadcrumb.ItemHome>{t("Home")}</Breadcrumb.ItemHome>
            {Module}
            <Breadcrumb.Item to={route}>{t(title)}</Breadcrumb.Item>
        </Breadcrumb.Main>
        <Breadcrumb.Title>{t("All {{title}}", { title: t(title) })}</Breadcrumb.Title>

        <Actions.Wrapper>
            <Actions.LeftSide>
                <Actions.SearchForm action={route} onChange={searchHandler} />
                <Actions.Tasks>
                    <Task.Setting onClick={() => { searchModal[1](true) }} />
                    {DeleteAll}
                    <Task.Info />
                    <Task.More />
                </Actions.Tasks>
            </Actions.LeftSide>

            <Actions.RightSide>
                {Add}
                <Actions.ExportButton route={route}>{t("Export")}</Actions.ExportButton>
            </Actions.RightSide>
        </Actions.Wrapper>
    </Breadcrumb.Wrapper>
}

export function Modals({ mediaModal, EditForm, SearchForm, method, title, route, edit, addModal, MainForm, editModal, searchModal, deleteModal, deleteAllModal, listForm }: any) {
    const Search = SearchForm ?? MainForm
    const Edit = EditForm ?? MainForm

    const { t } = useTranslation();
    return <>
        <Modal.Modal title={t("Edit {{title}}", { title: t(title) })} show={editModal}>
            <Form method={method || "post"} action={route + "/" + edit?.id} alertclass="m-6">
                <Modal.Content>
                    <Edit edit={edit} />

                </Modal.Content>
                <Modal.Footer>
                    <Button type="submit">{t("Save")}</Button>
                </Modal.Footer>
            </Form>
        </Modal.Modal>

        <Modal.Modal title={t("Add Attachment to {{title}}", { title: t(title) })} show={mediaModal}>
            <Form method="post" action={"medias/create"} alertclass="m-6">
                <input type="hidden" name="module" value={route.substr(1)} />
                <input type="hidden" name="item_id" value={edit?.id} />
                <Modal.Content>
                    <Grid.Col6>
                        <Upload multiple name="upload[]" id="upload" title={t("Files")} />
                    </Grid.Col6>
                    <Grid.Span6>
                        <Textarea name="description" rows={4} placeholder={t("Description")}>{t("Description")}</Textarea>
                    </Grid.Span6>
                </Modal.Content>
                <Modal.Footer>
                    <Button type="submit">{t("Save")}</Button>
                    <Button type="reset">{t("Reset")}</Button>
                </Modal.Footer>
            </Form>
        </Modal.Modal>

        <Modal.Modal title={t("Add {{title}}", { title: t(title) })} show={addModal}>
            <Form method={method || "post"} action={route + "/create"} alertclass="m-6">
                <Modal.Content>

                    <MainForm />
                </Modal.Content>
                <Modal.Footer>
                    <Button type="submit">{t("Save")}</Button>
                    <Button type="reset">{t("Reset")}</Button>
                </Modal.Footer>
            </Form>
        </Modal.Modal>

        <Modal.Modal title={t("Search {{title}}", { title: t(title) })} show={searchModal}>
            <Form method="get" action={route}>
                <input type="hidden" name="asearch" />
                <Modal.Content>

                    <Search />
                </Modal.Content>
                <Modal.Footer><Button type="submit" onClick={() => searchModal[1](false)}>{t("Search")}</Button></Modal.Footer>
            </Form>
        </Modal.Modal>

        <Modal.Delete show={deleteModal} title={"Delete " + title}>
            <Form key={edit.id} method="delete" action={route + "/" + edit.id} success={() => { deleteModal[1](false) }}>
                <Modal.AlertIcon />
                <Modal.ModalH3>{t("Are you sure you want to delete this ?")}</Modal.ModalH3>
                <Modal.YesButton type="submit">{t("Yes, I'm sure")}</Modal.YesButton>
                <Modal.NoButton href="#" onClick={(e: any) => { e.preventDefault(); deleteModal[1](false) }}>{t("No, cancel")}</Modal.NoButton>
            </Form>
        </Modal.Delete>

        <Modal.Delete show={deleteAllModal} title={"Delete All " + title}>

            <Modal.AlertIcon />
            <Modal.ModalH3>{t("Are you sure you want to delete this ?")}</Modal.ModalH3>
            <Modal.YesButton onClick={() => {
                var event = new Event('submit', { bubbles: true });
                listForm.current?.dispatchEvent(event);
                deleteAllModal[1](false)

            }}>{t("Yes, I'm sure")}</Modal.YesButton>
            <Modal.NoButton href="#" onClick={(e: any) => { e.preventDefault(); deleteAllModal[1](false) }}>{t("No, cancel")}</Modal.NoButton>

        </Modal.Delete>
    </>
}