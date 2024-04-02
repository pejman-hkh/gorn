import * as Modal from "../components/modal"
import Pagination from "../components/pagination"
import * as List from "../components/list"
import * as Grid from "../components/grid"
import Form, { Alert, Input, Select, Textarea } from "../components/form"
import { useContext, useRef, useState } from "react"
import { DataContext } from "../router/data"
import Button from "../components/button"

export function MenuForm({ ...props}) {
    let edit = props.edit

    return <Grid.Wrapper key={edit?.id} {...props}>
        <Grid.Col6>
            <Input type="text" name="title" defaultValue={edit?.title} required>Title</Input>
        </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="url" defaultValue={edit?.url} required>Url</Input>
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

export function Index() {
    const [data, setData] = useContext(DataContext);
    // useEffect(function() {
    //     alert('test')
    // },[data])

    const [edit, setEdit] = useState('')
    const editHandler = (e, item) => {
        setEdit(item)
    }

    const editModal = useRef(0)

    return <main>
        <List.Breadcrumbs title="Menu" link="/menus"></List.Breadcrumbs>

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
                {data?.data?.list?.map((item) => (
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
                            <List.ButtonEdit onClick={() => editHandler(e, item)}>
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
        {/* Edit User Modal */}
        <Modal.Modal title="Edit Menu" id="edit-user-modal">
            <Form action={"menus/"+edit?.id}>
                <Modal.Content>

                    <MenuForm edit={edit}></MenuForm>

                </Modal.Content>
                <Modal.Footer>
                    <Button type="submit">Save</Button>
                </Modal.Footer>
            </Form>
        </Modal.Modal>

        {/* Add User Modal */}
        <Modal.Modal title="Add Menu" id="add-user-modal">
            <Form action="menus/create">
                <Modal.Content>
                    <Alert />
                    <MenuForm />
                </Modal.Content>
                <Modal.Footer><Button type="submit">Save</Button></Modal.Footer>
            </Form>
        </Modal.Modal>

        {/* Delete User Modal */}
        <Modal.Delete>Are you sure you want to delete this menu?</Modal.Delete>
    </main >
}