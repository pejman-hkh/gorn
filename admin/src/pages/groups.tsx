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
    const dataContext = useContext(DataContext) as any
    const menu = dataContext.menu[0]
    if (menu?.current) {

        menu?.current.querySelectorAll("a").each(function (this: any) {
            console.log(this?.href)
        })
    }

    const modules: any = [
        ("users"),
        ("groups"),
        ("menus"),
        ("settings"),
        ("medias"),
        ("posts"),
        ("pages"),
        ("comments"),
    ]

    const permissions = [
        ("Create"),
        ("Update"),
        ("View"),
        ("Delete"),
    ]

    const toModelIndex = (permissions: any) => {
        let ret: any = {}
        for (let k in permissions) {
            let v = permissions[k]
            ret[v.module] = v
        }
        return ret
    }

    const permissionArray: any = toModelIndex(edit?.permissions)

    const checkAll = (e: any, per: string) => {
        document.querySelectorAll("." + per).each(function (this: any) {
            this.checked = e.target.checked
        })
    }

    const checkAllModel = (e: any, module: string) => {
        document.querySelectorAll("." + module).each(function (this: any) {
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
                {modules.map((module: string) => <List.Tr key={module}>
                    <List.Th>
                        {module}
                        <br /><Checkbox onChange={(e: any) => { checkAllModel(e, module) }}>{t("All")}</Checkbox>
                    </List.Th>
                    {permissions.map((per: string) =>
                        <List.Th key={module + per}><Checkbox defaultChecked={permissionArray[module.toLocaleLowerCase()] ? permissionArray[module.toLocaleLowerCase()][per.toLocaleLowerCase()] : false} className={per + " " + module} name={"permission[" + module.toLocaleLowerCase() + "][" + per.toLocaleLowerCase() + "]"} id={module + per}>{per}</Checkbox></List.Th>
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

    const dataContext = useContext(DataContext) as any
    const data = dataContext.data[0]

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
                        <List.Th>{t("Title")}</List.Th>
                        <List.Th width="15%">{t("User")}</List.Th>
                        <List.Th width="15%">{t("Date")}</List.Th>
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

                            <List.Td><Link to={"/users?id=" + item?.user?.id}>{item?.user?.name}</Link></List.Td>

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