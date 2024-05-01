import Pagination from "../components/pagination"
import * as List from "../components/list"
import * as Grid from "../components/grid"
import Form, { Editor, Input, Label, Select, SelectSearch, Textarea } from "../components/form"
import { useContext, useEffect, useRef, useState } from "react"
import { DataContext } from "../router/data"
import Link from "../router/link"
import DateTime from "../components/date"
import { useTranslation } from 'react-i18next';
import * as BreadCrumb from "../components/breadcrumb"
import * as Modal from "../components/modal"
import Button from "../components/button"
import Api from "../router/api"



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
            <Select name="status" title={t("Status")} defaultValue={edit?.status}>
                <option value="1">{t("Enable")}</option>
                <option value="0">{t("Disable")}</option>
            </Select>
        </Grid.Col6>
        <Grid.Col6>
            <SelectSearch title={t("Parent Category")} path="/admin/shop/categories" name="category_id" edit={edit} defaultValue={edit?.category_id}>
                <option value="0">{t("Main")}</option>
            </SelectSearch>
        </Grid.Col6>

        <Grid.Span6>
            <Editor noeditor={props?.noeditor || false} name="description" title={t("Description")} defaultValue={edit?.description || ""} />
        </Grid.Span6>

    </Grid.Wrapper>
}

const VariantForm = ({ ...props }) => {
    const [category, setCategory] = props?.category
    const { t } = useTranslation();
    const [variants, setVariants] = useState<any>([])
    const [check, setCheck] = useState(0)

    useEffect(() => {
        Api("admin/shop/categories?nopage=true&id=" + encodeURIComponent(category?.id)).then((data: any) => {
            let list: any[] = []
            data?.data?.list[0]?.variants.map((item: any) => {
                list.push(item)
            })
            setVariants(list)
        })
    }, [check, category?.id])

    return <>
        <Form key={category?.id} method="post" action={"shop/variants/create"} alertclass="" success={() => { setCheck(check + 1) }}>
            <input type="hidden" name="category_id" defaultValue={category?.id} />
            <Grid.Wrapper key={category?.id}>
                <Grid.Col6>
                    <Input type="text" name="title">{t("Title")}</Input>
                </Grid.Col6>
                <Grid.Col6>
                    <Label>&nbsp;</Label>
                    <Button type="submit">{t("Add Variant")}</Button>
                </Grid.Col6>
            </Grid.Wrapper>
        </Form>

        <Grid.Span6>
            <List.Table>
                <List.Tbody>

                    {variants.map((item: any) => {
                        return <List.Tr>
                            <List.Td>
                                {item.title}
                            </List.Td>
                            <List.Td width="10%">
                                <List.ButtonDelete ></List.ButtonDelete>
                            </List.Td>
                        </List.Tr>
                    })}
                </List.Tbody>
            </List.Table>
        </Grid.Span6>
    </>
}

const ParamsForm = ({ ...props }) => {
    let edit = props.edit
    const { t } = useTranslation();
    const [categories, setCategories] = useState<any>([])
    const [check, setCheck] = useState(0)
    const questionModal = props?.questionModal
    const [category, setCategory] = props?.category

    useEffect(() => {
        Api("admin/shop/param/categories?nopage=true&category_id=" + encodeURIComponent(edit?.id)).then((data: any) => {
            let list: any[] = []
            data?.data?.list.map((item: any) => {
                list.push(item)
            })
            setCategories(list)
        })
    }, [check, edit?.id])


    const [action, setAction] = useState("")
    useEffect(() => {
        deleteForm?.current.requestSubmit()
    }, [action])
    const deleteForm = useRef<any>(null)


    return <>
        <Form fref={deleteForm} key={Math.random()} method="delete" action={action} success={() => { setCheck(check + 1) }}>
        </Form>

        <Form key={edit?.id} method="post" action={"shop/param/categories/create"} alertclass="" success={() => { setCheck(check + 1) }}>
            <input type="hidden" name="category_id" defaultValue={edit?.id} />
            <Grid.Wrapper key={edit?.id} {...props}>
                <Grid.Col6>
                    <Input type="text" name="title">{t("Title")}</Input>
                </Grid.Col6>
                <Grid.Col6>
                    <Label>&nbsp;</Label>
                    <Button onClick={() => { }} type="submit">{t("Add Category")}</Button>
                </Grid.Col6>

                <Grid.Span6>
                    <List.Table>
                        <List.Tbody>

                            {categories.map((item: any) => {
                                return <List.Tr>
                                    <List.Td>

                                        {item.title}
                                    </List.Td>
                                    <List.Td width="20%">
                                        <Button color="gray" nopd={true} onClick={() => { questionModal[1](true); setCategory(item) }} type="button" className="px-2 py-1 ltr:mr-2 rtl:ml-2 bg-gray-500">{t("Add Question")}</Button>
                                        <List.ButtonDelete onClick={() => { setAction('/shop/param/categories/' + item?.id) }}></List.ButtonDelete>
                                    </List.Td>
                                </List.Tr>
                            })}
                        </List.Tbody>
                    </List.Table>
                </Grid.Span6>
            </Grid.Wrapper >
        </Form>
    </>
}

const QuestionForm = ({ ...props }) => {
    let [category, setCategory] = props?.category
    let [question, setQuestion] = props?.question
    const { t } = useTranslation();
    const [questions, setQuestions] = useState<any>([])
    const [check, setCheck] = useState(0)
    const answerModal = props?.answerModal

    useEffect(() => {
        Api("admin/shop/param/questions?nopage=true&category_id=" + encodeURIComponent(category?.id)).then((data: any) => {
            let list: any[] = []
            data?.data?.list.map((item: any) => {
                list.push(item)
            })
            setQuestions(list)
        })
    }, [check, category?.id])

    const [action, setAction] = useState("")
    useEffect(() => {
        deleteForm?.current.requestSubmit()
    }, [action])
    const deleteForm = useRef<any>(null)

    return <>
        <Form fref={deleteForm} key={Math.random()} method="delete" action={action} success={() => { setCheck(check + 1) }}>
        </Form>

        <Form key={category?.id} method="post" action={"shop/param/questions/create"} alertclass="" success={() => { setCheck(check + 1) }}>
            <input type="hidden" name="category_id" defaultValue={category?.id} />
            <Grid.Wrapper key={category?.id}>
                <Grid.Col6>
                    <Input type="text" name="title">{t("Title")}</Input>
                </Grid.Col6>
                <Grid.Col6>
                    <Label>&nbsp;</Label>
                    <Button type="submit">{t("Add Question")}</Button>
                </Grid.Col6>
            </Grid.Wrapper>
        </Form>

        <Grid.Span6>
            <List.Table>
                <List.Tbody>

                    {questions.map((item: any) => {
                        return <List.Tr>
                            <List.Td>

                                {item.title}
                            </List.Td>
                            <List.Td width="10%">
                                <Button color="gray" nopd={true} onClick={() => { answerModal[1](true); setQuestion(item) }} type="button" className="px-2 py-1 ltr:mr-2 rtl:ml-2 bg-gray-500">{t("Add Answer")}</Button>
                                <List.ButtonDelete onClick={() => { setAction('/shop/param/questions/' + item?.id) }}></List.ButtonDelete>
                            </List.Td>
                        </List.Tr>
                    })}
                </List.Tbody>
            </List.Table>
        </Grid.Span6>
    </>
}


const AnswerForm = ({ ...props }) => {
    let [question, setQuestion] = props?.question
    const { t } = useTranslation();
    const [answers, setAnswers] = useState<any>([])
    const [check, setCheck] = useState(0)

    useEffect(() => {
        Api("admin/shop/param/questions?nopage=true&id=" + encodeURIComponent(question?.id)).then((data: any) => {
            let list: any[] = []
            data?.data?.list[0]?.answers.map((item: any) => {
                list.push(item)
            })
            setAnswers(list)
        })
    }, [check, question?.id])

    const [action, setAction] = useState("")
    useEffect(() => {
        deleteForm?.current.requestSubmit()
    }, [action])
    const deleteForm = useRef<any>(null)
    return <>
        <Form fref={deleteForm} key={Math.random()} method="delete" action={action} success={() => { setCheck(check + 1) }}>
        </Form>

        <Form key={question?.id} method="post" action={"shop/param/answers/create"} alertclass="" success={() => { setCheck(check + 1) }}>
            <input type="hidden" name="question_id" defaultValue={question?.id} />
            <Grid.Wrapper key={question?.id}>
                <Grid.Col6>
                    <Input type="text" name="title">{t("Title")}</Input>
                </Grid.Col6>
                <Grid.Col6>
                    <Label>&nbsp;</Label>
                    <Button type="submit">{t("Add Answer")}</Button>
                </Grid.Col6>
            </Grid.Wrapper>
        </Form>

        <Grid.Span6>
            <List.Table>
                <List.Tbody>

                    {answers.map((item: any) => {
                        return <List.Tr>
                            <List.Td>

                                {item.title}
                            </List.Td>
                            <List.Td width="10%">

                                <List.ButtonDelete onClick={() => { setAction('/shop/param/answers/' + item?.id) }}></List.ButtonDelete>
                            </List.Td>
                        </List.Tr>
                    })}
                </List.Tbody>
            </List.Table>
        </Grid.Span6>
    </>
}

const ParamsButton = ({ ...props }) => {
    const { t } = useTranslation();
    const id = 'params-' + Math.random()
    return <><button {...props} data-tooltip-target={id} type="button" className="bg-blue-600 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg">
        <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    </button>
        <List.Tooltip id={id}>{t("Parameters")}</List.Tooltip>
    </>
}

const VariantButton = ({ ...props }) => {
    const { t } = useTranslation();
    const id = 'variant-' + Math.random()
    return <><button {...props} data-tooltip-target={id} type="button" className="bg-blue-600 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg">
        <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2" />
        </svg>

    </button>
        <List.Tooltip id={id}>{t("Variants")}</List.Tooltip>
    </>
}


export function Index() {

    const route = "/shop/categories"
    const title = "Category"

    const dataContext = useContext(DataContext) as any
    const data = dataContext.data[0]

    const [edit, setEdit] = useState<any>({})
    const editModal = useState(false)
    const searchModal = useState(false)
    const addModal = useState(false)
    const deleteModal = useState(false)
    const deleteAllModal = useState(false)
    const paramsModal = useState(false)
    const variantModal = useState(false)
    const [actionValue, setActionValue] = useState("")

    const editHandler = (e: any, item: any) => {
        e.preventDefault()
        editModal[1](true)
        setEdit(item)
    }

    const listForm = useRef<any>(null)
    const { t } = useTranslation();

    const questionModal = useState<boolean>(false)
    const answerModal = useState<boolean>(false)

    const category = useState<any>({})
    const question = useState<any>({})

    const ModuleBreadcrumb = <BreadCrumb.Item to="/shop/dashboard">{t("Shop")}</BreadCrumb.Item>

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
                                <VariantButton onClick={() => { variantModal[1](true); category[1](item) }}></VariantButton>
                                <ParamsButton onClick={() => { paramsModal[1](true); setEdit(item) }}></ParamsButton>
                                <List.ButtonEdit onClick={(e: any) => editHandler(e, item)}></List.ButtonEdit>
                                <List.ButtonDelete onClick={() => { deleteModal[1](true); setEdit(item) }}></List.ButtonDelete>
                            </List.TdAction>
                        </List.Tr>
                    ))}

                </List.Tbody>
            </List.Table>
        </Form>
        <Pagination pagination={data?.data?.pagination} module={route}></Pagination>

        <List.Modals {...{ title, route, edit, MainForm, addModal, editModal, searchModal, deleteModal, deleteAllModal, listForm }}></List.Modals >

        <Modal.Modal title={t("Add Variant")} show={variantModal}>
            <Modal.Content>
                <VariantForm category={category} />
            </Modal.Content>
        </Modal.Modal>

        <Modal.Modal title={t("Add Parameters")} show={paramsModal}>
            <Modal.Content>
                <ParamsForm edit={edit} questionModal={questionModal} category={category} />
            </Modal.Content>
        </Modal.Modal>

        <Modal.Modal title={t("Add Question")} show={questionModal} size="max-w-3xl" zindex="z-50">
            <Modal.Content>
                <QuestionForm {...{ questionModal, answerModal, category, question }} />
            </Modal.Content>
        </Modal.Modal>

        <Modal.Modal title={t("Add Answer")} show={answerModal} size="max-w-2xl" zindex="z-50">
            <Modal.Content>
                <AnswerForm {...{ category, question }} />
            </Modal.Content>
        </Modal.Modal>

    </>
}