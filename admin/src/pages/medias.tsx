import Pagination from "../components/pagination"
import * as List from "../components/list"
import * as Grid from "../components/grid"
import Form, { Input, Select, Editor, Textarea, Upload } from "../components/form"
import { useContext, useRef, useState } from "react"
import { DataContext } from "../router/data"
import Link from "../router/link"
import DateTime from "../components/date"
import { useTranslation } from 'react-i18next';

export function SearchForm({...props}) {
    return <MainForm noeditor="true" />
}

export function MainForm({ ...props }) {
    let edit = props.edit
    const { t } = useTranslation();

    return <Grid.Wrapper key={edit?.id} {...props}>
   
        <Grid.Col6>
            <Select name="status" title={t("Status")} defaultValue={edit?.status}>
                <option value="1">{t("Enable")}</option>
                <option value="0">{t("Disable")}</option>
            </Select>
        </Grid.Col6>
        <Grid.Col6>
            <Upload multiple name="upload[]" id="upload" title={t("Files")} />
        </Grid.Col6>
        <Grid.Span6>
        <Textarea name="description" rows={4} placeholder={t("Description")} defaultValue={edit?.description}>{t("Description")}</Textarea>

        </Grid.Span6>

    </Grid.Wrapper>
}

export function Index() {

    const route = "/medias"
    const title = "Media"

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
                        <List.Th width="20%">{t("File")}</List.Th>
                        <List.Th>{t("User")}</List.Th>
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
                                {item.file}
                            </List.TdTitle>

                 
                            <List.Td><Link to={"/users?id=" + item?.user?.id}>{item?.user?.name}</Link></List.Td>
           
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

        <List.Modals {...{ SearchForm, title, route, edit, MainForm, addModal, editModal, searchModal, deleteModal, deleteAllModal, listForm }}></List.Modals >

    </>
}