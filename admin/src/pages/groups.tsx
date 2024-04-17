import Pagination from "../components/pagination"
import * as List from "../components/list"
import * as Grid from "../components/grid"
import Form, { Input, Checkbox } from "../components/form"
import { useContext, useRef, useState } from "react"
import { DataContext } from "../router/data"

import Link from "../router/link"
import DateTime from "../components/date"
import { useTranslation } from 'react-i18next';

export function SearchForm({ ...props }) {
    let edit = props.edit
    const { t } = useTranslation();
    return <Grid.Wrapper key={edit?.id} {...props}>
        <Grid.Span6>
            <Input type="text" name="title" defaultValue={edit?.title}>{t("Title")}</Input>
        </Grid.Span6>
    </Grid.Wrapper>
}

export function MainForm({ ...props }) {
    let edit = props.edit
    const { t } = useTranslation();
    const models: any = [
        t("User"),
        t("Group"),
        t("Menu"),
        t("Setting"),
        t("Media"),
        t("Post"),
        t("Page"),
        t("Comment"),
    ]

    const permissions = [
        t("Create"),
        t("Update"),
        t("View"),
        t("Delete"),
    ]

    const toModelIndex = (permissions: any) => {
        let ret: any = {}
        for (let k in permissions) {
            let v = permissions[k]
            ret[v.model] = v
        }
        return ret
    }

    const permissionArray: any = toModelIndex(edit?.permissions)

    const checkAll = (e: any, per: string) => {
        document.querySelectorAll("." + per).each(function (this: any) {
            this.checked = e.target.checked
        })
    }

    const checkAllModel = (e: any, model: string) => {
        document.querySelectorAll("." + model).each(function (this: any) {
            this.checked = e.target.checked
        })
    }


    return <Grid.Wrapper key={edit?.id} {...props}>
        <Grid.Span6>
            <Input type="text" name="title" defaultValue={edit?.title}>{t("Title")}</Input>
        </Grid.Span6>

        <Grid.Span6>
            <List.Table>
                <List.Tr>
                    <List.Th></List.Th>{permissions.map((per: string) => <List.Th>
                        {per}
                        <br />
                        <Checkbox onChange={(e: any) => { checkAll(e, per) }}>{t("All")}</Checkbox>
                    </List.Th>)}
                </List.Tr>
                {models.map((model: string) => <List.Tr key={model}>
                    <List.Th>
                        {model}
                        <br /><Checkbox onChange={(e: any) => { checkAllModel(e, model) }}>{t("All")}</Checkbox>
                    </List.Th>
                    {permissions.map((per: string) =>
                        <List.Th key={model + per}><Checkbox defaultChecked={permissionArray[model.toLocaleLowerCase()]?permissionArray[model.toLocaleLowerCase()][per.toLocaleLowerCase()]:false} className={per + " " + model} name={"permission[" + model.toLocaleLowerCase() + "][" + per.toLocaleLowerCase() + "]"} id={model + per}>{per}</Checkbox></List.Th>
                    )}
                </List.Tr>
                )}
            </List.Table>
        </Grid.Span6>

    </Grid.Wrapper>
}

export function Index() {

    const route = "/groups"
    const title = "Group"

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
    const method = "json"

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
                        <List.Th width="30%">{t("Title")}</List.Th>
                        <List.Th>{t("User")}</List.Th>
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
                                {item.title}
                            </List.TdTitle>

                            <List.Td><Link to={"/users?id=" + item?.user?.id}>{item?.user?.Name}</Link></List.Td>

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