export const weekChange = (ds) => {
    let week = new Date(ds);
    let dateweek = week.getDay();
    let i = 7 - dateweek;
    switch (i) {
        case 7:
            ds = ds + "(七)";
            break
        case 1:
            ds = ds + "(六)";
            break
        case 2:
            ds = ds + "(五)";
            break
        case 3:
            ds = ds + "(四)";
            break
        case 4:
            ds = ds + "(三)";
            break
        case 5:
            ds = ds + "(二)";
            break
        case 6:
            ds = ds + "(一)";
            break
        default:
    }
    return ds;
}
