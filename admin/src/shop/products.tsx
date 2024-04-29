import Pagination from "../components/pagination"
import * as List from "../components/list"
import * as Grid from "../components/grid"
import Form, { Input, Select, Editor, SelectSearch } from "../components/form"
import { useContext, useRef, useState } from "react"
import { DataContext } from "../router/data"
import Link from "../router/link"
import DateTime from "../components/date"
import { useTranslation } from 'react-i18next';
import * as BreadCrumb from "../components/breadcrumb"
import Api from "../router/api"


export function SearchForm() {
    return <MainForm noeditor="true" />
}

function ButtonPrice({ children, ...props }: any) {

    const { t } = useTranslation()
    const id = Math.random()
    return <><button data-tooltip-target={id} {...props} onClick={props?.onClick} type="button" className="rtl:ml-1 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2" />
        </svg>

        {children}</button>
        <List.Tooltip id={id}>{t("Prices")}</List.Tooltip>
    </>
}

export function MainForm({ ...props }) {
    let edit = props.edit
    const { t } = useTranslation();
    const [categories, setCategories] = useState<any>([])

    return <Grid.Wrapper key={edit?.id} {...props}>

        <Grid.Span6>
            <SelectSearch onChange={(item: any) => {
                Api("admin/shop/categories/param?nopage=true&id=" + encodeURIComponent(item?.value)).then((data: any) => {
                    let list: any[] = []
                    data?.data?.categories.map((item: any) => {
                        list.push(item)
                    })
                    setCategories(list)
                })
            }} default={true} title={t("Category")} path={"/admin/shop/categories"} name="category_id" edit={edit} defaultValue={edit?.category_id}>
                <option value="">{t("Select")}</option>
            </SelectSearch>
        </Grid.Span6>

        <Grid.Col6>
            <Input type="text" name="title" defaultValue={edit?.title}>{t("Title")}</Input>
        </Grid.Col6>

        <Grid.Col6>
            <Input type="text" name="url" defaultValue={edit?.url}>{t("Url")}</Input>
        </Grid.Col6>

        <Grid.Col6>
            <Input type="text" name="stock" defaultValue={edit?.stock}>{t("Stock")}</Input>
        </Grid.Col6>


        <Grid.Col6>
            <Select name="status" title={t("Status")} defaultValue={edit?.status}>
                <option value="1">{t("Enable")}</option>
                <option value="0">{t("Disable")}</option>
            </Select>
        </Grid.Col6>

        <Grid.Col6>
            <Select name="comment_allow" title={t("Has Comment")} defaultValue={edit?.comment_allow}>
                <option value="true">{t("Has")}</option>
                <option value="false">{t("Doesn't have")}</option>
            </Select>
        </Grid.Col6>

        <Grid.Span6>
            <Editor noeditor={props?.noeditor || false} name="short_content" title={t("Short Content")} defaultValue={edit?.short_content || ""} />
        </Grid.Span6>

        <Grid.Span6>
            <Editor noeditor={props?.noeditor || false} name="content" title={t("Content")} defaultValue={edit?.content || ""} />
        </Grid.Span6>

        <Grid.Span6>
            {categories?.map((category: any) => {
                return <Grid.Wrapper className="border-t border-gray-200 p-5">
                    <Grid.Span6> <h1 className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">{category.title}</h1></Grid.Span6>
                    {category.questions.map((question: any) => {
                        return <Grid.Col6>
                            <Input type="text" name={"question["+question?.id+"]"}>{question.title}</Input>
                        </Grid.Col6>
                    })}
                </Grid.Wrapper>
            })}
        </Grid.Span6>


    </Grid.Wrapper>
}

export function Index() {

    const route = "/shop/products"
    const title = "Product"

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
    const ModuleBreadcrumb = <BreadCrumb.Item to="/shop/dashboard">{t("Shop")}</BreadCrumb.Item>

    const method = "json"    
    return <>
        <List.BreadCrumb {...{ ModuleBreadcrumb, title, route, setActionValue, deleteAllModal, addModal, setEdit, searchModal }}></List.BreadCrumb>

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
                            <List.Td><Link to={"/medias?module=" + encodeURIComponent(route.substr(1)) + "&item_id=" + item?.id}>{t("Attachments")}</Link></List.Td>

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
                                <ButtonPrice onClick={() => { mediaModal[1](true); setEdit(item) }}></ButtonPrice>
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

        <List.Modals {...{ method, mediaModal, SearchForm, title, route, edit, MainForm, addModal, editModal, searchModal, deleteModal, deleteAllModal, listForm }}></List.Modals >

    </>
}