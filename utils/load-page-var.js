const loadPageVar = sVar => decodeURI(
    window.location.search.replace(
        new RegExp(
            `^(?:.*[&\\?]${encodeURI(sVar).replace(/[\.\+\*]/g, '\\$&')}(?:\\=([^&]*))?)?.*$`,
            'i'
        ), '$1'
    )
);

export default loadPageVar