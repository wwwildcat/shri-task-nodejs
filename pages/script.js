document.addEventListener('DOMContentLoaded', function() {
	document.body.onclick = function (event) {
		if (event.target == document.querySelector('.RepoList-arrow')) {
			toggleRepolist(document.body);
		}
		if (event.target == document.querySelector('.BranchList-arrow')) {
			toggleBranchlist(document.body);
		}
	}
});

function toggleRepolist (elem) {
    if (elem.classList && (elem.classList.contains('Icon-arrowDownBlack') || elem.classList.contains('Icon-arrowUpBlack'))) {
		elem.classList.toggle('Icon-arrowDownBlack');
		elem.classList.toggle('Icon-arrowUpBlack');
    }
    let list = document.querySelector('.RepoList');
    if (list.classList) {
        list.classList.toggle('RepoList_closed');
    }
}

function toggleBranchlist (elem) {
    if (elem.classList && (elem.classList.contains('Icon-arrowDownGray') || elem.classList.contains('Icon-arrowUpGray'))) {
		elem.classList.toggle('Icon-arrowDownGray');
		elem.classList.toggle('Icon-arrowUpGray');
    }
    let list = document.querySelector('.BranchList');
    if (list.classList) {
        list.classList.toggle('BranchList_closed');
    }
}