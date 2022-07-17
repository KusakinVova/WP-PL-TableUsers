// let dataUsers = '';
// let dataUsersFilter = '';

jQuery(document).ready(function($) {

    const containerClass = '.tableUsers';
    let dataUsers = '';
    let dataUsersFilter = '';
    const countOnPage = 10;
    let countStart = 0;
    let countEnd = countOnPage;
    let paginationActive = 1;
    let paginationCount = 0;


    function createMainBlock(){
        // create table block
        let filter = '<div class="tableUsers__filter filtertable">';
        filter += '<div class="filtertable__block"><i class="fa-solid fa-magnifying-glass icon-search"></i><input class="filtertable__name" type="text" placeholder="Login">';
        filter += '<button class="filtertable__clear"><i class="fa-solid fa-xmark"></i></button></div>';
        filter += '<button class="filtertable__button">Filter</button>';
        filter += '<button class="filtertable__reset">reset</button>';
        filter += '<select class="filtertable__select"><option value="all">All</option></select>';
        filter += '</div>';
        $(containerClass).append(filter);
        let table = '<div class="tableUsers__container"><table class="tableUsers__table">';
        table += '<col class="tableUsers__col_s"><col class="tableUsers__col_m"><col class="tableUsers__col_s"><thead><tr>';
        table +='<th>Login <i class="fa-solid fa-arrow-down-up-across-line sort" data-sortby="Login" data-sort="asc"></i></th>';
        table +='<th>Email <i class="fa-solid fa-arrow-down-up-across-line sort" data-sortby="Email" data-sort="asc"></i></th>';
        table +='<th>Roles <i class="fa-solid fa-arrow-down-up-across-line sort" data-sortby="roles" data-sort="asc"></i></th>';
        table +='</tr></thead><tbody></tbody></table></div>';
        table += '<div class="tableUsers__pagination"></div>';
        $(containerClass).append(table);
    }
    createMainBlock();

    $('.filtertable__clear').click(function(){
        $('.filtertable__name').val('');
        filterTable();
    });

    $('.filtertable__reset').click(function(){
        $('.filtertable__name').val('');
        $('.filtertable__select').prop('selectedIndex',0);
        filterTable();
    });

    $('.filtertable__select').change(function() {
        filterTable();
    });

    function filterTable(){
        const role = $('.filtertable__select').val();
        const val = $('.filtertable__name').val();
        dataUsersFilter = dataUsers;
        if(role !== 'all') dataUsersFilter = dataUsersFilter.filter((a) => a.roles === role);
        dataUsersFilter = dataUsersFilter.filter((a) =>  a.Login.indexOf(val) > -1 );
        updateTable();
    }

    $('.filtertable__button, .tableUsers .icon-search').click(function(){
        filterTable();
    });

    function updateIcons(){
        $('.tableUsers__table .sort').removeClass('fa-arrow-down');
        $('.tableUsers__table .sort').removeClass('fa-arrow-up');
        $('.tableUsers__table .sort').removeClass('active');
        $('.tableUsers__table .sort').addClass('fa-arrow-down-up-across-line');
    }

    $('.tableUsers .sort').click(function(){
        // sorting table 
        updateIcons();
        $(this).removeClass('fa-arrow-down-up-across-line');
        let sortby = $(this).data('sortby');
        let sort = $(this).data('sort');
        if(sort === 'asc') {
            $(this).addClass('fa-arrow-down');
            $(this).addClass('active');
            $(this).data('sort', 'desc');
            dataUsersFilter.sort((a, b) => a[sortby] > b[sortby] ? 1 : -1);
        }
        if(sort === 'desc') {
            $(this).addClass('fa-arrow-up');
            $(this).addClass('active');
            $(this).data('sort', 'asc');
            dataUsersFilter.sort((a, b) => a[sortby] > b[sortby] ? -1 : 1);
        }
        createTable(dataUsersFilter.slice(countStart, countEnd));
    });

    async function getData(){
        const data_ajax = {
            action: 'table_users_ajax',
        }

        let result;
        await $.ajax({
            url: myajax,
            method: 'POST',
            dataType: 'html',
            data: data_ajax,
            beforeSend: function() {
                // console.log('load...');
            },
            success: function (data) {
                // console.log(data);
                result = JSON.parse(data);
            },
            fail: function(){
                result = null;
            }
        });
        return result;
    }

    function createTable(arData){
        let tbody = '';
        for (key in arData) {
            tbody += '<tr>';
            tbody += '<td>'+ arData[key]['Login'] + '</td>';
            tbody += '<td>'+ arData[key]['Email'] + '</td>';
            tbody += '<td>' + arData[key]['roles'] +'</td>';
            tbody += '</tr>';
        }
        $(containerClass + ' tbody').html(tbody);
    }

    function createPagination() {
        const box = document.querySelector('.tableUsers__pagination');
        box.innerHTML = '';
        if( paginationCount > 1 ){
            for (let index = 1; index <= paginationCount; index++) {
                const el = document.createElement('span');
                if(index === paginationActive) el.classList.add('active');
                el.addEventListener('click', clickPagination);
                el.textContent = index;
                el.dataset.page = index;
                box.appendChild(el);
            }
        }
    }

    function clickPagination(){
        const page = $(this).data('page');
        if(page !== paginationActive) {
            paginationActive = page;
            createPagination();
            // console.log(page);
            countStart = (page - 1) * countOnPage;
            countEnd = page * countOnPage;
            createTable(dataUsersFilter.slice(countStart, countEnd));
        }
    }

    function updateSelectRole(arData){
        const roles = [];
        for (key in arData) {
            let role = arData[key]['roles'];
            if(!roles.includes(role)){
                roles.push(role);
                $('.tableUsers__filter .filtertable__select').append($('<option>', {value: role, text: role}));
            }
        }
        // console.log(roles);
        return roles;
    }

    function updateTable() {
        countStart = 0;
        countEnd = countOnPage;
        paginationActive = 1;
        paginationCount = 0;
        createTable(dataUsersFilter.slice(countStart, countEnd));
        paginationCount = Math.ceil(dataUsersFilter.length / countOnPage);
        createPagination();
        updateIcons();
    }

    async function asyncInit(){
        dataUsers = Object.values(await getData());
        dataUsersFilter = [... dataUsers];
        updateSelectRole(dataUsersFilter);
        updateTable();
    }
    asyncInit();

});