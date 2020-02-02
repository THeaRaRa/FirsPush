$(function(){
    fetchArticle()
    // to get value from input
    $('#searchArticle').on('keyup', function(){
        searchArticle($('#searchArticle').val())
    })

    $('#callModal').on('click',function(){
        $('#modalArticle').modal('show') // popup modal when btn clicked
        $('#modalTitle').text('Add')
        // set blank to all input
        $('#title').val('')
        $('#desc').val('')
        $('#image').val('')
    })

    $('#save').on('click', function(){
        let article = {
            TITLE: $('#title').val(),
            DESCRIPTION: $('#desc').val(),
            IMAGE: $('#image').val()
        }
        if ($('#modalTitle').text() == "Add"){
            addArticle(article)
        } else {
            updateArticle(article, $('#aid').val())
        }
    })
})

function addArticle(article){
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles`,
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic QU1TQVBJQURNSU46QU1TQVBJUEBTU1dPUkQ="
        },
        data: JSON.stringify(article),
        success: function(res){
            fetchArticle()
           $('#modalArticle').modal('hide')
        },
        error: function(er){
            console.log(er)
        }
    })
}

function fetchArticle(){
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles?page=1&limit=15`,
        method: 'GET',
        // function (xhr, res, er)
        success: function (res){
            appendTable(res.DATA)    
        },
        
        // error: function (er){ 
        //     console.log(er)
        // } 
    })
}

function searchArticle(title){
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles?title=${title}&page=1&limit=15`,
        method: 'GET',
        success: function(res){
            appendTable(res.DATA)
        },
        error: function(er){
            console.log(er)
        },
        
    })
}


function appendTable(article) {
    let content = ''
    for (a of article){
        content += `
        <tr>
            <th scope="row">${a.ID}</th>
            <td>${a.TITLE}</td>
            <td>${a.DESCRIPTION}</td>
            <td>${formateDate(a.CREATED_DATE)}</td>
            <td><img src=${a.IMAGE} /></td>
            <td>    
            <button class="btn btn-outline-success waves" onclick="goToDetail('${a.ID}')">View</button>
            <button class="btn btn-outline-danger waves" onclick="deleteArticle('${a.ID}')">Delete</button>
            <button class="btn btn-outline-danger waves" onclick="editArticle(this)" data-id=${a.ID}>Edit</button>
            </td>
          </tr>
        `
    }
    $('tbody').html(content)
}

function formateDate(createDate){
    let year = createDate.substring(0, 4)
    let month = createDate.substring(5, 6)
    let day = createDate.substring(6, 8)
    let date = [year, month, day]
    return date.join('/')
}

function editArticle(btnEdit){
    // for call modal
    $('#modalArticle').modal('show')
    $('#modalTitle').text('Edit')
    // get value
    let title = $(btnEdit).parent().siblings().eq(1).text();
    let desc = $(btnEdit).parent().siblings().eq(2).text();
    let imageURL = $(btnEdit).parent().siblings(3).find('img').attr('src')
    $('#title').val(title)
    $('#desc').val(desc)
    $('#image').val(imageURL)
    $('#aid').val($(btnEdit).attr('data-id'))

}

function updateArticle(article, id){
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles/${id}`,
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic QU1TQVBJQURNSU46QU1TQVBJUEBTU1dPUkQ="
        },
        data: JSON.stringify(article),
        success: function(res){
            fetchArticle()
           $('#modalArticle').modal('hide')
        },
        error: function(er){
            console.log(er)
        }
    })
}

function goToDetail(id){
    window.location.href = `detail.html?id=${id}`
}

function deleteArticle(articleid){

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `http://110.74.194.124:15011/v1/api/articles/${articleid}`,
                method: 'DELETE',
                success: function(res){
                    fetchArticle()
                }
            })
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })

}


