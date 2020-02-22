import React from 'react';
import * as SurveyQuestionAnswerOptionsService from "../../../services/SurveyQuestionAnswerOptionsService";
import swal from 'sweetalert2';

class SurveyQuestionAnswerOptionsList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            questionId: "",
            text: "",
            value: "",
            userId: "",
            additionalInfo: "",
           
            listData:[],
            pageNumArr:[],
            totalCount:'',
            index: 0,
            size: 5,
            totalItem:0
       
        };

        this.onChange = this.onChange.bind(this);
        this.editButton = this.editButton.bind(this);
        this.deleteButton = this.deleteButton.bind(this);
        this.addForm = this.addForm.bind(this);
        this.getByIndexAndSize=this.getByIndexAndSize.bind(this);
        this.pageSize=this.pageSize.bind(this);
        this.onPagination=this.onPagination.bind(this);
        }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value});
        console.log(e.target.value);
    }

    componentDidMount() {
    this.getByIndexAndSize(this.state.index,this.state.size)
    }

    getByIndexAndSize(index, size) {

        SurveyQuestionAnswerOptionsService.getByIndSize(index, size)
            .then(response => {
                const dataToList = response.items;
               // console.log("page data "+dataToList);

                const lastPage = Math.ceil(dataToList[0].totalCount / this.state.size) - 1
                console.log("page count "+lastPage);

                var pageArr = [];
                for (var i = 0; i < lastPage; i++) {
                    pageArr.push(i);
                }
                this.setState({
                    listData: dataToList,
                    totalCount: lastPage,
                    pageNumArr: pageArr,
                    totalItem:dataToList[0].totalCount
                })
            })
            .catch(console.log.error);
    }


    addForm(){
        this.props.history.push('./SurveyQuestionAnswerOptionsform')
    }
    
    editButton(id,e){

        this.props.history.push('/SurveyQuestionAnswerOptionsform/'+id)
    }

    deleteButton(id,e){
        swal({
            title: "Are you sure you want to delete this answer option?",
            text: "You won't be able to recover this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "red",
            cancelButtonColor: '#7ac7f6',
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it!",
            background: '#0f2940'
          }).then((result) => {
            if (result.value) {
                swal({
                    title: "Deleted!",
                    text: "Answer option has been deleted.",
                    type: "success",
                    background: '#0f2940',
                    confirmButtonColor: '#7ac7f6'
                })
                SurveyQuestionAnswerOptionsService.surveyQuestionAnswerOptionsDel(id)
                    .then(()=>{this.getByIndexAndSize(this.state.index,this.state.size)
                    })
                    .catch(console.error)

            }
          })
        }

        onPagination(event) {
            var pageIndex = this.state.index
    
            if (event.target.id === "first") {
                pageIndex = 0
            } else if (event.target.id === "next") {
                if (this.state.index < this.state.totalCount) {
                pageIndex = this.state.index + 1
                }
            } else if (event.target.id === "prev") {
                if (this.state.index > 0) {
                pageIndex = this.state.index - 1
                }
            } else if (event.target.id === "last") { 
                pageIndex = this.state.totalCount 
            } 
            this.getByIndexAndSize(pageIndex, this.state.size)  
            this.setState({
                index:pageIndex
            })
        }

        pageSize(e){
            this.onChange(e)
            this.getByIndexAndSize(this.state.index, e.target.value)
        }
  

    render() {
        //pagination numbering
        var listPages = this.state.pageNumArr.map((item) => {
            var pageNum = item + 1;
            return (
                <span>
                    <li id={pageNum} onClick={e => { this.pageNumbers(e, pageNum) }} class="page-item"><a class="page-link" href="#">{pageNum}</a></li>
                </span>
            )
        })

        var mapTheList = this.state.listData.map((item) => {
          
            return (
                <tr key={item.id}>
                    
                    <td> {item.questionId} </td>
                    <td> {item.text} </td>
                    <td> {item.value} </td>
                   <td> {item.userId}</td>
                    <td>{item.additionalInfo} </td>
                    <span>
                        <button  class="btn btn-light btn--icon" onClick={e => this.editButton(item.id, e)}  ><span><i class="zmdi zmdi-edit zmdi-hc-fw"></i></span></button>
                        <button class="btn btn-light btn--icon" onClick={e => this.deleteButton(item.id, e)}   ><span><i class="zmdi zmdi-delete zmdi-hc-fw"></i></span></button>
              
                    </span>

                </tr>
            )
        })



        return (
       
            <React.Fragment>

                <section>
                    <header class="content__title" >
                        <h1>Survey Question Answer Options TABLES</h1>

                        <div class="actions">
                        <a className="actions__item zmdi zmdi-plus-circle" onClick={this.addForm}></a>
                            <a href="" class="actions__item zmdi zmdi-trending-up"></a>
                            <a href="" class="actions__item zmdi zmdi-check-all"></a>

                            <div class="dropdown actions__item">
                                <i data-toggle="dropdown" class="zmdi zmdi-more-vert"></i>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a href="" class="dropdown-item">Refresh</a>
                                    <a href="" class="dropdown-item">Manage Widgets</a>
                                    <a href="" class="dropdown-item">Settings</a>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Survey Question Answer Options List</h4>

                            <div class="table-responsive">
                                <table id="data-table" class="table">
                                    <thead>


                                        <tr>
                                            <th> QuestionId</th>
                                            <th> Text</th>
                                            <th>Value</th>
                                            <th>User Id</th>
                                            <th> Additional Info</th>
                                            
                                        </tr>
                                    </thead>    
                                    <tbody>

                                        {mapTheList}

                              
                                  
                        
                                    </tbody>
                                </table>
                                <div class="dataTables_info" id="data-table_info" role="status" aria-live="polite">
                                Showing {this.state.index} to {this.state.totalCount} of {this.state.totalItem} entries</div>

                    <select className="form-control" name="size" value={this.state.size} onChange={this.pageSize}
                      style={{width:'auto', position:'center'}}            
                    >
                        <option style={{ backgroundColor: "black" }} value='5'>5</option>
                        <option style={{ backgroundColor: "black" }} value='10'>10</option>
                        <option style={{ backgroundColor: "black" }} value='20'>20</option>
                        <option style={{ backgroundColor: "black" }} value='50'>50</option>
                    </select>
                <nav>
                    <ul className="pagination justify-content-center">
                        <li  onClick={this.onPagination} className="page-item pagination-first">
                        <a id="first" className="page-link" href="#"></a></li>
                        <li  onClick={this.onPagination} className="page-item pagination-prev">
                        <a id="prev" className="page-link" href="#"></a></li>
                        {/* {listPages} */}
                        <li  onClick={this.onPagination} className="page-item pagination-next">
                        <a id="next" className="page-link" href="#"></a></li>
                        <li  onClick={this.onPagination} className="page-item pagination-last">
                        <a id="last" className="page-link" href="#"></a></li>
                    </ul>
                </nav>

                            </div>



                        </div>
                    </div>


                </section>

            </React.Fragment>

        )
    }
}



export default SurveyQuestionAnswerOptionsList;




