import Pagination from "../components/pagination"
import * as List from "../components/list"
import * as Grid from "../components/grid"
import Form, { Input, Select, Editor, SelectSearch } from "../components/form"
import { useContext, useEffect, useRef, useState } from "react"
import { DataContext } from "../router/data"
import Link from "../router/link"
import DateTime from "../components/date"
import { useTranslation } from 'react-i18next';

export function SearchForm() {
    return <MainForm noeditor="true" />
}

export function MainForm({ ...props }) {
    let edit = props.edit
    const { t } = useTranslation();

    const typeSelect = useState<any>({})
    const selected = typeSelect[0]

    return <Grid.Wrapper key={edit?.id} {...props}>

        <Grid.Col6>
            <SelectSearch default={true} select={typeSelect} title={t("Post Type")} path="/admin/post/types" name="type_id" edit={edit} defaultValue={edit?.type_id}>
                <option value="">{t("Select")}</option>
            </SelectSearch>
        </Grid.Col6>

        <Grid.Col6>
            <SelectSearch default={true} title={t("Category")} path={"/admin/post/categories?type_id=" + (selected?.value||"")} name="category_id" edit={edit} defaultValue={edit?.category_id}>
            <option value="">{t("Select")}</option>
            </SelectSearch>
        </Grid.Col6>


        <Grid.Col6>
            <Input type="text" name="title" defaultValue={edit?.title}>{t("Title")}</Input>
        </Grid.Col6>
        <Grid.Col6>
            <Input type="text" name="url" defaultValue={edit?.url}>{t("Url")}</Input>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="status" title={t("Status")} defaultValue={edit?.status}>
                <option value="1">{t("Enable")}</option>
                <option value="0">{t("Disable")}</option>
            </Select>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="has_comment" title={t("Has Comment")} defaultValue={edit?.has_comment}>
                <option value="1">{t("Has")}</option>
                <option value="0">{t("Doesn't have")}</option>
            </Select>
        </Grid.Col6>

        <Grid.Span6>
            <Editor noeditor={props?.noeditor || false} name="short_content" title={t("Short Content")} defaultValue={edit?.short_content || ""} />
        </Grid.Span6>

        <Grid.Span6>
            <Editor noeditor={props?.noeditor || false} name="content" title={t("Content")} defaultValue={edit?.content || ""} />
        </Grid.Span6>

    </Grid.Wrapper>
}

export function Index() {

    const route = "/post/posts"
    const title = "Post"

    const dataContext = useContext(DataContext) as any
    const data = dataContext.data[0]

    const [edit, setEdit] = useState<any>({})
    const editModal = useState(false)
    const searchModal = useState(false)
    const addModal = useState(false)
    const deleteModal = useState(false)
    const mediaModal = useState(false)
    const deleteAllModal = useState(false)
    const [actionValue, setActionValue] = useState("")

    const editHandler = (e: any, item: any) => {
        e.preventDefault()
        editModal[1](true)
        setEdit(item)
    }

    const listForm = useRef<any>(null)

    const { t } = useTranslation();

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
                        <List.Th>{t("Type")}</List.Th>
                        <List.Th>{t("Attachments")}</List.Th>
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
                            <List.Td><Link to={"/post/types?id=" + item?.type?.id}>{item?.type?.title}</Link></List.Td>
                            <List.Td><Link to={"/medias?module=" + encodeURIComponent( route.substr(1) )+ "&item_id=" + item?.id}>{t("Attachments")}</Link></List.Td>

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
                                <List.ButtonFile onClick={() => { mediaModal[1](true); setEdit(item) }}></List.ButtonFile>
                                <List.ButtonEdit onClick={(e: any) => editHandler(e, item)}></List.ButtonEdit>
                                <List.ButtonDelete onClick={() => { deleteModal[1](true); setEdit(item) }}></List.ButtonDelete>
                            </List.TdAction>
                        </List.Tr>
                    ))}

                </List.Tbody>
            </List.Table>
        </Form>
        <Pagination pagination={data?.data?.pagination} module={route}></Pagination>

        <List.Modals {...{ mediaModal, SearchForm, title, route, edit, MainForm, addModal, editModal, searchModal, deleteModal, deleteAllModal, listForm }}></List.Modals >

    </>
}