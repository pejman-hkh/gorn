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

export function MenuForm({ ...props }) {
    let edit = props.edit

    return <Grid.Wrapper key={edit?.id} {...props}>
        <Grid.Col6>
            <Input type="text" name="title" defaultValue={edit?.title}>Title</Input>
        </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="url" defaultValue={edit?.url}>Url</Input>
        </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="icon" defaultValue={edit?.icon}>Icon</Input>
        </Grid.Col6>
        <Grid.Col6>
            <Select name="position" title="Position" defaultValue={edit?.position}>
                <option value="">Select</option>
                <option value="1">Top</option>
            </Select>

        </Grid.Col6>

        <Grid.Span6>
            <Textarea name="svg" rows={4} placeholder="Just put svg paths" defaultValue={edit?.svg}>Svg</Textarea>

        </Grid.Span6>
    </Grid.Wrapper>
}

function Head({...props}) {
    return <Breadcrumb.Wrapper>
        <Breadcrumb.Main>
            <Breadcrumb.ItemHome></Breadcrumb.ItemHome>
            <Breadcrumb.Item to="/dashboard">Cms</Breadcrumb.Item>
            <Breadcrumb.Item to={props.link}>{props.title}</Breadcrumb.Item>
        </Breadcrumb.Main>
        <Breadcrumb.Title>All {props.title}s</Breadcrumb.Title>

        <Actions.Wrapper>
            <Actions.LeftSide>
                <Actions.SearchForm />
                <Actions.Tasks></Actions.Tasks>
            </Actions.LeftSide>

            <Actions.RightSide>
                <Actions.AddButton>Add {props.title}</Actions.AddButton>
                <Actions.ExportButton>Export</Actions.ExportButton>
            </Actions.RightSide>
        </Actions.Wrapper>
    </Breadcrumb.Wrapper>
}
export function Index() {
    const dataContext = useContext(DataContext) as Array<any>;
    const data = dataContext[0]

    const [edit, setEdit] = useState({id:0})
    const editHandler = (item:any) => {
        setEdit(item)
    }

    const searchModal = useRef<HTMLDivElement>(null)

    return <main>
        <Head title="Menu" link="/menus"></Head>

        <List.Table>
            <List.Thead>
                <tr>
                    <List.Th>
                        <List.Checkbox id="checkbox-1" aria-describedby="checkbox-1">checkbox</List.Checkbox>
                    </List.Th>
                    <List.Th>Title</List.Th>
                    <List.Th>User</List.Th>
                    <List.Th>Url</List.Th>
                    <List.Th>Position</List.Th>
                    <List.Th>Status</List.Th>
                    <List.Th>Date</List.Th>
                    <List.Th>Actions</List.Th>
                </tr>
            </List.Thead>
            <List.Tbody>
                {data?.data?.list?.map((item:any) => (
                    <List.Tr>
                        <List.TdCheckbox>
                            <List.CheckboxTd id="checkbox-1" aria-describedby="checkbox-1">checkbox</List.CheckboxTd>
                        </List.TdCheckbox>

                        <List.TdTitle>
                            {item.title}
                        </List.TdTitle>

                        <List.Td>{item.user.id}</List.Td>
                        <List.TdText>
                            {item.url}
                        </List.TdText>

                        <List.Td> {item.position}</List.Td>
                        <List.Td>
                            <List.ActiveBadge />
                        </List.Td>
                        <List.Td>{item.created_at}</List.Td>
                        <List.TdAction>
                            <List.ButtonEdit onClick={() => editHandler(item)}>
                                Edit
                            </List.ButtonEdit>
                            <List.ButtonDelete>
                                Delete
                            </List.ButtonDelete>
                        </List.TdAction>
                    </List.Tr>
                ))}

            </List.Tbody>
        </List.Table>
        <Pagination pagination={data?.data?.pagination} module="/menus"></Pagination>
        {/* Edit Modal */}
        <Modal.Modal title="Edit Menu" id="edit-modal">
            <Form action={"menus/" + edit?.id}>
                <Modal.Content>

                    <MenuForm edit={edit}></MenuForm>

                </Modal.Content>
                <Modal.Footer>
                    <Button type="submit">Save</Button>
                </Modal.Footer>
            </Form>
        </Modal.Modal>

        {/* Add Modal */}
        <Modal.Modal title="Add Menu" id="add-modal">
            <Form action="menus/create">
                <Modal.Content>
                
                    <MenuForm />
                </Modal.Content>
                <Modal.Footer><Button type="submit">Save</Button></Modal.Footer>
            </Form>
        </Modal.Modal>

        {/* Search Modal */}
        <Modal.Modal title="Search Menu" id="search-modal" pref={searchModal}>
            <Form method="get" action="menus">
                <input type="hidden" name="asearch" />
                <Modal.Content>
              
                    <MenuForm />
                </Modal.Content>
                <Modal.Footer><Button type="submit" onClick={function() {searchModal.current?.classList?.add('hidden');searchModal.current?.previousElementSibling?.classList?.add('hidden')}}>Search</Button></Modal.Footer>
            </Form>
        </Modal.Modal>

        {/* Delete User Modal */}
        <Modal.Delete id="delete-modal" title="Delete Menu">Are you sure you want to delete this menu?</Modal.Delete>
    </main >
}