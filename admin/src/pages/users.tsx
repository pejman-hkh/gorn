import Pagination from "../components/pagination"
import * as List from "../components/list"
import * as Grid from "../components/grid"
import Form, { Input, Label, Select, SelectSearch } from "../components/form"
import { useContext, useRef, useState } from "react"
import { DataContext } from "../router/data"

import Link from "../router/link"
import DateTime from "../components/date"
import { useTranslation } from 'react-i18next';

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
            <Select name="status" title={t("Is Admin")} defaultValue={edit?.isadmin}>
                <option value="1">{t("Admin")}</option>
                <option value="0">{t("User")}</option>
            </Select>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="status" title={t("Is Main")} defaultValue={edit?.ismain}>
                <option value="1">{t("Main")}</option>
                <option value="0">{t("Not main")}</option>
            </Select>
        </Grid.Col6>


        <Grid.Col6>
            <Select name="groupid" title={t("Group")} defaultValue={edit?.groupid}>
                <option value="">{t("Select")}</option>
            </Select>
        </Grid.Col6>
    </Grid.Wrapper>
}

export function MainForm({ ...props }) {
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
            <Input type="text" name="password" defaultValue={edit?.password}>{t("Password")}</Input>
        </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="repassword">{t("Re-Password")}</Input>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="status" title={t("Status")} defaultValue={edit?.status}>
                <option value="1">{t("Enable")}</option>
                <option value="0">{t("Disable")}</option>
            </Select>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="status" title={t("Is Admin")} defaultValue={edit?.isadmin}>
                <option value="1">{t("Admin")}</option>
                <option value="0">{t("User")}</option>
            </Select>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="status" title={t("Is Main")} defaultValue={edit?.ismain}>
                <option value="1">{t("Main")}</option>
                <option value="0">{t("Not main")}</option>
            </Select>
        </Grid.Col6>


        <Grid.Col6>
            <Label htmlFor="group">{t("Group")}</Label>

            <SelectSearch path="/admin/groups" name="groupid" />

        </Grid.Col6>
    </Grid.Wrapper>
}

export function Index() {

    const route = "/users"
    const title = "User"

    const dataContext = useContext(DataContext) as Array<any>
    const data = dataContext[0]

    const [edit, setEdit] = useState<any>({})
    const editModal = useState(false)
    const searchModal = useState(false)
    const addModal = useState(false)
    const deleteModal = useState(false)
    const deleteAllModal = useState(false)
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

                            <List.Td><Link to={"/users?id=" + item?.user?.id}>{item?.user?.Name}</Link></List.Td>

                            <List.Td>
                                {item.isadmin ? t("Admin") : t("User")}
                            </List.Td>

                            <List.Td>
                                {item.ismain ? t("Main") : t("Not main")}
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
                            </List.TdAction>
                        </List.Tr>
                    ))}

                </List.Tbody>
            </List.Table>
        </Form>
        <Pagination pagination={data?.data?.pagination} module={route}></Pagination>

        <List.Modals {...{ SearchForm, method, title, route, edit, MainForm, addModal, editModal, searchModal, deleteModal, deleteAllModal, listForm }}></List.Modals >

    </>
}