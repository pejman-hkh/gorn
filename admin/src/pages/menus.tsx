import Pagination from "../components/pagination"
import * as List from "../components/list"
import * as Grid from "../components/grid"
import Form, { Input, Select, SelectSearch, Textarea } from "../components/form"
import { useContext, useRef, useState } from "react"
import { DataContext } from "../router/data"
import Link from "../router/link"
import DateTime from "../components/date"
import { useTranslation } from 'react-i18next';

let positionArray: any = {}

function getPositionTitle(position: number) {
    return positionArray.find((v: any) => {
        return v.id == position
    })
}

export function MainForm({ ...props }) {
    let edit = props.edit
    const { t } = useTranslation();

    return <Grid.Wrapper key={edit?.id} {...props}>
        <Grid.Col6>
            <Input type="text" name="title" defaultValue={edit?.title}>{t("Title")}</Input>
        </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="url" defaultValue={edit?.url}>{t("Url")}</Input>
        </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="priority" defaultValue={edit?.priority}>{t("Priority")}</Input>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="position" title={t("Position")} defaultValue={edit?.position}>
                <option value="">{t("Select")}</option>
                {positionArray?.map((v: any) => <option key={v.id} value={v.id}>{v.title}</option>)}
            </Select>

        </Grid.Col6>
        <Grid.Col6>
            <Select name="status" title={t("Status")} defaultValue={edit?.status}>

                <option value="1">{t("Enable")}</option>
                <option value="0">{t("Disable")}</option>

            </Select>
        </Grid.Col6>
        <Grid.Col6>
            <SelectSearch title={t("Parent Menu")} path="/admin/menus" name="menu_id" edit={edit} defaultValue={edit?.menu_id}>
                <option value="0">{t("Main")}</option>
            </SelectSearch>
        </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="icon" defaultValue={edit?.icon}>{t("Icon")}</Input>
        </Grid.Col6>
        <Grid.Span6>
            <Textarea name="svg" rows={4} placeholder={t("Just put svg paths")} defaultValue={edit?.svg}>{t("Svg")}</Textarea>

        </Grid.Span6>

    </Grid.Wrapper>
}

export function Index() {

    const route = "/menus"
    const title = "Menu"

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
    positionArray = [{ id: 1, title: t("Top") }, { id: 2, title: t("Right") }, { id: 3, title: t("Bottom") }, { id: 4, title: t("Left") }]
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
                        <List.Th width="20%">{t("Title")}</List.Th>
                        <List.Th>{t("User")}</List.Th>
                        <List.Th>{t("Position")}</List.Th>
                        <List.Th>{t("Url")}</List.Th>
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
                                {item.title}
                            </List.TdTitle>

                 
                            <List.Td><Link to={"/users?id=" + item?.user?.id}>{item?.user?.name}</Link></List.Td>
                            <List.TdText>
                                {getPositionTitle(item.position)?.title}
                            </List.TdText>
                            <List.TdText>
                                {item.url}
                            </List.TdText>


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

        <List.Modals {...{ title, route, edit, MainForm, addModal, editModal, searchModal, deleteModal, deleteAllModal, listForm }}></List.Modals >

    </>
}