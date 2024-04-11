import * as Modal from "../components/modal"
import * as Breadcrumb from "../components/breadcrumb"
import * as Actions from "../components/actions"
import Pagination from "../components/pagination"
import * as List from "../components/list"
import * as Grid from "../components/grid"
import Form, { Input, Select, Textarea } from "../components/form"
import { useContext, useRef, useState } from "react"
import { DataContext } from "../router/data"
import Button from "../components/button"
import * as Task from "../components/tasks"
import { useGoTo } from "../router/router"
import Link from "../router/link"
import toDate from "../components/date"

const positionArray: any = [{ id: 1, title: "Top" }, { id: 2, title: "Right" }, { id: 3, title: "Bottom" }, { id: 4, title: "Left" }]

function getPositionTitle(position:number) {
    return positionArray.find((v:any) => {
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
        <Breadcrumb.Wrapper>
            <Breadcrumb.Main>
                <Breadcrumb.ItemHome></Breadcrumb.ItemHome>
                <Breadcrumb.Item to="/dashboard">Cms</Breadcrumb.Item>
                <Breadcrumb.Item to={route}>{title}</Breadcrumb.Item>
            </Breadcrumb.Main>
            <Breadcrumb.Title>All {title}s</Breadcrumb.Title>

            <Actions.Wrapper>
                <Actions.LeftSide>
                    <Actions.SearchForm action="/menus" onChange={searchHandler} />
                    <Actions.Tasks>
                        <Task.Setting onClick={() => { searchModal[1](true) }} />
                        <Task.Delete onClick={() => { setActionValue("delete"); deleteAllModal[1](true) }} />
                        <Task.Info />
                        <Task.More />
                    </Actions.Tasks>
                </Actions.LeftSide>

                <Actions.RightSide>
                    <Actions.AddButton onClick={() => { addModal[1](true); setEdit({}) }}>Add {title}</Actions.AddButton>
                    <Actions.ExportButton>Export</Actions.ExportButton>
                </Actions.RightSide>
            </Actions.Wrapper>
        </Breadcrumb.Wrapper>
        <Form fref={listForm} disableclass="true" method="post" action={route + "/actions"} alertclass="m-6">
            <input type="hidden" name="action" value={actionValue} />

            <List.Table>
                <List.Thead>
                    <tr>
                        <List.Th>
                            <List.Checkbox id="checkbox-1" aria-describedby="checkbox-1">checkbox</List.Checkbox>
                        </List.Th>
                        <List.Th width="30%">Title</List.Th>
                        <List.Th>User</List.Th>
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
                            <List.Td>{toDate(item.created_at)}</List.Td>
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

        <Modal.Modal title={"Edit " + title} show={editModal}>
            <Form action={route + "/" + edit?.id} alertclass="m-6">
                <Modal.Content>

                    <MainForm edit={edit}></MainForm>

                </Modal.Content>
                <Modal.Footer>
                    <Button type="submit">Save</Button>
                </Modal.Footer>
            </Form>
        </Modal.Modal>

        <Modal.Modal title={"Add " + title} show={addModal}>
            <Form action={route + "/create"} alertclass="m-6">
                <Modal.Content>

                    <MainForm />
                </Modal.Content>
                <Modal.Footer>
                    <Button type="submit">Save</Button>
                    <Button type="reset">Reset</Button>
                </Modal.Footer>
            </Form>
        </Modal.Modal>

        <Modal.Modal title={"Search " + title} show={searchModal}>
            <Form method="get" action={route}>
                <input type="hidden" name="asearch" />
                <Modal.Content>

                    <MainForm />
                </Modal.Content>
                <Modal.Footer><Button type="submit" onClick={() => searchModal[1](false)}>Search</Button></Modal.Footer>
            </Form>
        </Modal.Modal>

        <Modal.Delete show={deleteModal} title={"Delete " + title}>
            <Form key={edit.id} method="delete" action={route + "/" + edit.id}>
                <Modal.AlertIcon />
                <Modal.ModalH3>Are you sure you want to delete this ?</Modal.ModalH3>
                <Modal.YesButton type="submit">Yes, I'm sure</Modal.YesButton>
                <Modal.NoButton href="#" onClick={(e: any) => { e.preventDefault(); deleteModal[1](false) }}>No, cancel</Modal.NoButton>
            </Form>
        </Modal.Delete>

        <Modal.Delete show={deleteAllModal} title={"Delete All " + title}>

            <Modal.AlertIcon />
            <Modal.ModalH3>Are you sure you want to delete this ?</Modal.ModalH3>
            <Modal.YesButton onClick={() => {
                var event = new Event('submit', { bubbles: true });
                listForm.current?.dispatchEvent(event);
                deleteAllModal[1](false)

            }}>Yes, I'm sure</Modal.YesButton>
            <Modal.NoButton href="#" onClick={(e: any) => { e.preventDefault(); deleteAllModal[1](false) }}>No, cancel</Modal.NoButton>

        </Modal.Delete>

    </>
}