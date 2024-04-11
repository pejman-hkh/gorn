import Pagination from "../components/pagination"
import * as List from "../components/list"
import * as Grid from "../components/grid"
import Form, { Input, Select, Textarea } from "../components/form"
import { useContext, useRef, useState } from "react"
import { DataContext } from "../router/data"

import { useGoTo } from "../router/router"
import Link from "../router/link"
import toDate from "../components/date"
import t from "../components/translate"

const positionArray: any = [{ id: 1, title: "Top" }, { id: 2, title: "Right" }, { id: 3, title: "Bottom" }, { id: 4, title: "Left" }]

function getPositionTitle(position: number) {
    return positionArray.find((v: any) => {
        return v.id == position
    })
}

export function MainForm({ ...props }) {
    let edit = props.edit

    return <Grid.Wrapper key={edit?.id} {...props}>
        <Grid.Col6>
            <Input type="text" name="title" defaultValue={edit?.title}>Title</Input>
        </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="url" defaultValue={edit?.url}>Url</Input>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="position" title="Position" defaultValue={edit?.position}>
                <option value="">Select</option>
                {positionArray?.map((v: any) => <option key={v.id} value={v.id}>{v.title}</option>)}
            </Select>

        </Grid.Col6>
        <Grid.Col6>
            <Select name="status" title="Status" defaultValue={edit?.status}>
                <option value="">Select</option>
                <option value="0">Disable</option>
                <option value="1">Enable</option>

            </Select>
        </Grid.Col6>
        <Grid.Col6>
            <Select name="menuid" title="Parent Menu" defaultValue={edit?.menuid}>
                <option value="">Select</option>

            </Select>
        </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="icon" defaultValue={edit?.icon}>Icon</Input>
        </Grid.Col6>
        <Grid.Span6>
            <Textarea name="svg" rows={4} placeholder="Just put svg paths" defaultValue={edit?.svg}>Svg</Textarea>

        </Grid.Span6>

    </Grid.Wrapper>
}

export function Index() {

    const route = "/menus"
    const title = "Menu"

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

    const listForm = useRef<any>(null)

    return <>
        <List.BreadCrumb {...{title,route,searchHandler, setActionValue,deleteAllModal, addModal,setEdit,searchModal}}></List.BreadCrumb>

        <Form fref={listForm} disableclass="true" method="post" action={route + "/actions"} alertclass="m-6">
            <input type="hidden" name="action" value={actionValue} />

            <List.Table>
                <List.Thead>
                    <tr>
                        <List.Th>
                            <List.Checkbox id="checkbox-1" aria-describedby="checkbox-1">checkbox</List.Checkbox>
                        </List.Th>
                        <List.Th width="30%">{t("Title")}</List.Th>
                        <List.Th>{t("User")}</List.Th>
                        <List.Th>Position</List.Th>
                        <List.Th>Url</List.Th>
                        <List.Th>Position</List.Th>
                        <List.Th>Status</List.Th>
                        <List.Th>Date</List.Th>
                        <List.Th>Actions</List.Th>
                    </tr>
                </List.Thead>
                <List.Tbody>
                    {data?.data?.list?.map((item: any) => (
                        <List.Tr key={item.id}>
                            <List.TdCheckbox>
                                <List.CheckboxTd name="ids[]" value={item.id} id="checkbox-1" aria-describedby="checkbox-1">checkbox</List.CheckboxTd>
                            </List.TdCheckbox>

                            <List.TdTitle>
                                {item.title}
                            </List.TdTitle>

                            <List.Td><Link to={"/users?id=" + item.user.id}>{item.user.Name}</Link></List.Td>
                            <List.TdText>
                                {getPositionTitle(item.position)?.title}
                            </List.TdText>
                            <List.TdText>
                                {item.url}
                            </List.TdText>

                            <List.Td> {item.position}</List.Td>
                            <List.Td>
                                <List.ActiveBadge active={item?.status} />
                            </List.Td>
                            <List.Td>
                                {toDate(item.created_at)} <br />
                                {item.updated_at != item.created_at ? toDate(item.updated_at) : ""}
                            </List.Td>
                            <List.TdAction>
                                <List.ButtonEdit onClick={(e: any) => editHandler(e, item)}>
                                    Edit
                                </List.ButtonEdit>
                                <List.ButtonDelete onClick={() => { deleteModal[1](true); setEdit(item) }}>
                                    Delete
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