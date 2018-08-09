// var tableAttributaire = $('#tableAttributaire').DataTable({
//     dom: "<'row'<'col-sm-4'l><'col-sm-5'B><'col-sm-3'f>>" +
//         "<'row'<'col-sm-12'tr>>" +
//         "<'row'<'col-sm-5'i><'col-sm-7'p>>",
//     buttons: [
//         {
//             extend: 'copy',
//             text: 'Copier',
//             className: 'btn btn-default btn-xs'
//         }
//         ,{
//             extend: 'csv',
//             className: 'btn btn-default btn-xs'
//         }
//         ,
//         {
//             extend: 'excel',
//             messageTop: 'La liste des',
//             className: 'btn btn-default btn-xs' 
//         },
//         {
//             extend: 'pdf',
//             messageTop: 'La liste des',
//             className: 'btn btn-default btn-xs'
//         },
//         {
//             extend: 'print',
//             text: 'Imprimer',
//             className: 'btn btn-default btn-xs',
//             messageTop: 'La liste des'
//         }
//     ],
    

//     "language": {
//         "sProcessing": "Traitement en cours...",
//         "sSearch": "Rechercher&nbsp;:",
//         "sLengthMenu": "Afficher _MENU_ &eacute;l&eacute;ments",
//         "sInfo": "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
//         "sInfoEmpty": "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
//         "sInfoFiltered": "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
//         "sInfoPostFix": "",
//         "sLoadingRecords": "Chargement en cours...",
//         "sZeroRecords": "Aucun &eacute;l&eacute;ment &agrave; afficher",
//         "sEmptyTable": "Aucune donn&eacute;e disponible dans le tableau",
//         "oPaginate": {
//             "sFirst": "Premier",
//             "sPrevious": "Pr&eacute;c&eacute;dent",
//             "sNext": "Suivant",
//             "sLast": "Dernier"
//         },
//         "oAria": {
//             "sSortAscending": ": activer pour trier la colonne par ordre croissant",
//             "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
//         }
//     }
// });

$('.agent-toggle').bind('click', function () {
    if ($(this).hasClass('open')) {
        $(this).removeClass('open').addClass('close');
        $(this).empty();
        $(this).append('<i class="clip-chevron-up"></i>');
        $('#main_agent_list_content').hide();
    } else {
        $(this).removeClass('close').addClass('open');
        $(this).empty();
        $(this).append('<i class="clip-chevron-down"></i>');
        $('#main_agent_list_content').show();
    }
});