import Pagination from "../components/pagination"
import * as List from "../components/list"
import * as Grid from "../components/grid"
import Form, { Input, Select, SelectSearch } from "../components/form"
import { useContext, useRef, useState } from "react"
import { DataContext } from "../router/data"

import Link from "../router/link"
import DateTime from "../components/date"
import { useTranslation } from 'react-i18next';
import * as Modal from "../components/modal"
import Button from "../components/button"

function SearchForm({ ...props }) {
    let edit = props.edit
    const { t } = useTranslation();
    return <Grid.Wrapper key={edit?.id} {...props}>
        <Grid.Col6>
            <Input type="text" name="name" defaultValue={edit?.name}>{t("Name")}</Input>
        </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="email" defaultValue={edit?.email}>{t("Email")}</Input>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="status" title={t("Status")} defaultValue={edit?.status}>
                <option value="1">{t("Enable")}</option>
                <option value="0">{t("Disable")}</option>
            </Select>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="is_admin" title={t("Is Admin")} defaultValue={edit?.isadmin}>
                <option value="1">{t("Admin")}</option>
                <option value="0">{t("User")}</option>
            </Select>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="is_main" title={t("Is Main")} defaultValue={edit?.ismain}>
                <option value="1">{t("Main")}</option>
                <option value="0">{t("Not main")}</option>
            </Select>
        </Grid.Col6>


        <Grid.Col6>
            <SelectSearch title={t("Group")} path="/admin/groups" name="group_id">
            </SelectSearch>

        </Grid.Col6>
    </Grid.Wrapper>
}

export function EditForm({ ...props }) {
    return <MainForm {...props} disablePassword={true} />
}

export function PasswordForm() {
    const { t } = useTranslation();

    return <Grid.Wrapper>
        <Grid.Col6>
            <Input type="text" name="password">{t("Password")}</Input>
        </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="repassword">{t("Re-Password")}</Input>
        </Grid.Col6>
    </Grid.Wrapper>

}

export function MainForm({ ...props }) {
    let edit = props.edit
    const { t } = useTranslation();

    const password = props?.disablePassword ? "" : <><Grid.Col6>
        <Input type="text" name="password" defaultValue={edit?.password}>{t("Password")}</Input>
    </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="repassword">{t("Re-Password")}</Input>
        </Grid.Col6></>

    return <Grid.Wrapper key={edit?.id} {...props}>
        <Grid.Col6>
            <Input type="text" name="name" defaultValue={edit?.name}>{t("Name")}</Input>
        </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="email" defaultValue={edit?.email}>{t("Email")}</Input>
        </Grid.Col6>
        {password}
        <Grid.Col6>
            <Select name="status" title={t("Status")} defaultValue={edit?.status}>
                <option value="1">{t("Enable")}</option>
                <option value="0">{t("Disable")}</option>
            </Select>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="is_admin" title={t("Is Admin")} defaultValue={edit?.is_admin}>
                <option value="true">{t("Admin")}</option>
                <option value="false">{t("User")}</option>
            </Select>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="is_main" title={t("Is Main")} defaultValue={edit?.is_main}>
                <option value="false">{t("Not main")}</option>
                <option value="true">{t("Main")}</option>
            </Select>
        </Grid.Col6>


        <Grid.Col6>

            <SelectSearch title={t("Group")} path="/admin/groups" name="group_id" edit={edit} defaultValue={edit?.group_id}>
                <option>{t("Select")}</option>
            </SelectSearch>

        </Grid.Col6>
    </Grid.Wrapper>
}

const LoginButton = () => {
    const { t } = useTranslation();
    const id = 'delete' + Math.random()
    return <><button data-tooltip-target={id} type="button" className="bg-blue-400 inline-flex items-center px-2 py-1 text-sm font-medium text-center text-white rounded-lg">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14v3m4-6V7a3 3 0 1 1 6 0v4M5 11h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
        </svg>
    </button>
        <List.Tooltip id={id}>{t("Login")}</List.Tooltip>
    </>
}

const PasswordButton = ({...props}) => {
    const { t } = useTranslation();
    const id = 'delete' + Math.random()
    return <><button {...props} data-tooltip-target={id} type="button" className="bg-blue-400 inline-flex items-center px-2 py-1 text-sm font-medium text-center text-white rounded-lg">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
        </svg>


    </button>
        <List.Tooltip id={id}>{t("Change Password")}</List.Tooltip>
    </>
}

export function Index() {

    const route = "/users"
    const title = "User"

    const dataContext = useContext(DataContext) as any
    const data = dataContext.data[0]

    const [edit, setEdit] = useState<any>({})
    const editModal = useState(false)
    const searchModal = useState(false)
    const addModal = useState(false)
    const deleteModal = useState(false)
    const deleteAllModal = useState(false)
    const passwordModal = useState(false)
    const [actionValue, setActionValue] = useState("")

    const editHandler = (e: any, item: any) => {
        e.preventDefault()
        editModal[1](true)
        setEdit(item)
    }

    const listForm = useRef<any>(null)
    const { t } = useTranslation();
    const method = "post"
    return <>
        <List.BreadCrumb {...{ title, route, setActionValue, deleteAllModal, addModal, setEdit, searchModal }}></List.BreadCrumb>

        <Form fref={listForm} disableclass="true" method="post" action={route + "/actions"} alertclass="m-6">
            <input type="hidden" name="action" value={actionValue} />

            <List.Table>
                <List.Thead>
                    <tr>
                        <List.Th>
                            <List.Checkbox />
                        </List.Th>
                        <List.Th width="20%">{t("Name")}</List.Th>
                        <List.Th>{t("Email")}</List.Th>
                        <List.Th>{t("User")}</List.Th>
                        <List.Th>{t("Is Admin")}</List.Th>
                        <List.Th>{t("Is Main")}</List.Th>
                        <List.Th>{t("Status")}</List.Th>
                        <List.Th>{t("Date")}</List.Th>
                        <List.Th width="5%">{t("Actions")}</List.Th>
                    </tr>
                </List.Thead>
                <List.Tbody>
                    {data?.data?.list?.map((item: any) => (
                        <List.Tr key={item.id}>
                            <List.TdCheckbox>
                                <List.CheckboxTd name="ids[]" value={item.id} />
                            </List.TdCheckbox>

                            <List.TdTitle>
                                {item.name}
                            </List.TdTitle>

                            <List.Td>
                                {item.email}
                            </List.Td>

                            <List.Td><Link to={"/users?id=" + item?.user?.id}>{item?.user?.name}</Link></List.Td>

                            <List.Td>
                                {item.is_admin ? t("Admin") : t("User")}
                            </List.Td>

                            <List.Td>
                                {item.is_main ? t("Main") : t("Not main")}
                            </List.Td>

                            <List.Td>
                                <List.ActiveBadge active={item?.status} />
                            </List.Td>
                            <List.Td>
                                <DateTime time={item.created_at} />
                                <br />
                                {item.updated_at != item.created_at ? <DateTime time={item.updated_at} /> : ""}
                            </List.Td>
                            <List.TdAction>
                                <List.ButtonEdit onClick={(e: any) => editHandler(e, item)}>

                                </List.ButtonEdit>
                                <List.ButtonDelete onClick={() => { deleteModal[1](true); setEdit(item) }}>

                                </List.ButtonDelete>
                                <LoginButton />
                                <PasswordButton onClick={() => {passwordModal[1](true); setEdit(item)}} />
                            </List.TdAction>
                        </List.Tr>
                    ))}

                </List.Tbody>
            </List.Table>
        </Form>
        <Pagination pagination={data?.data?.pagination} module={route}></Pagination>

        <List.Modals {...{ EditForm, SearchForm, method, title, route, edit, MainForm, addModal, editModal, searchModal, deleteModal, deleteAllModal, listForm }}></List.Modals >

        <Modal.Modal title={t("Change {{title}} Password", { title: t(title) })} show={passwordModal}>
            <Form method="post" action={route + "/" + edit?.id+"/password"} alertclass="m-6">
                <Modal.Content>
                    <PasswordForm />

                </Modal.Content>
                <Modal.Footer>
                    <Button type="submit">{t("Save")}</Button>
                </Modal.Footer>
            </Form>
        </Modal.Modal>


    </>
}