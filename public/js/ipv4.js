function ipv4_dot2int(ip_dot){
    /** Convert ip_dot from its dotted-decimal notation to an int number.
     * * ip_dot is a string, like '127.0.0.1'.
     * Returns an int number.
     */

    var ip_arr = [],
        aux = ip_dot.split('.'),
        ip_int = 0;

    for (var i = 0; i < 4; i++){
        ip_arr.push(parseInt(aux[i]));
    }

    for (var i = 0; i < 4; i++){
        ip_int = ip_int << 8;
        ip_int += ip_arr[i];
    }

    return ip_int;
}

function ipv4_int2dot(ip_int){
    /* Convert ip_int from an int number to its dotted-decimal notation.
     * * ip_int is an integer number.
     * Returns a string.
     */

    var ip_arr = [],
        ip_dot = '';

    for (var i = 0; i < 4; i++){
        ip_arr.push(ip_int & 255);
        ip_int = ip_int >> 8;
    }

    ip_arr.reverse();

    for (var i = 0; i < 4; i++){
        ip_dot += ip_arr[i] + '.';
    }

    return ip_dot.slice(0, -1);
}

function fill_mask(n){
    /* Given n bits of a mask, generates that mask. */

    var ip_mask = 0;

    for (var i = 0; i < n; i++){
        ip_mask++;
        if (i != n - 1) { ip_mask = ip_mask << 1; }
    }

    ip_mask = ip_mask << (32 - n);

    return ip_mask;
}

function auto_mask(ip_addr){
    /* Set mask according to classful network rules.
     * ip_addr must be a valid IP address in int format.
     */

    if (0 <= ip_addr && ip_addr <= 2147483647){
        return fill_mask(8);
    }
    else if (-2147483648 <= ip_addr && ip_addr <= -1073741825){
        return fill_mask(16);
    }
    else if (-1073741824 <= ip_addr && ip_addr <= -536870913){
        return fill_mask(24);
    }
    else {
        return fill_mask(28);
    }
}

function ipv4_is_private(ip_addr){
    /* Returns true or false for a private ip_addr --must be as an int. */

    if (((ip_addr >= 167772160) && (ip_addr <= 184549375)) ||
        ((ip_addr >= -1408237568) && (ip_addr <= -1408172033)) ||
        ((ip_addr >= -1062731776) && (ip_addr <= -1062666241))){
        return true;
    }
    else { return false; }
}

function get_wildcard(ip_mask){
    return ~ip_mask;
}

function get_network(ip_addr, ip_mask){
    return ip_addr & ip_mask;
}

function get_broadcast(ip_addr, ip_mask){
    return get_network(ip_addr, ip_mask) | get_wildcard(ip_mask);
}

function get_first_host(ip_addr, ip_mask){
    return get_network(ip_addr, ip_mask) + 1;
}

function get_last_host(ip_addr, ip_mask){
    return get_broadcast(ip_addr, ip_mask) - 1;
}

function get_number_hosts(ip_mask){
    return (-1 ^ ip_mask) - 1;
}


/**
 * INTERFACE FUNCTIONS
 */
function parser(text){
    /* text could be 127.0.0.1 or 127.0.0.1/8 or 127.0.0.1/255.0.0.0 */

    var re_ip_addr = '^(((1[0-9]|[1-9]?)[0-9]|2([0-4][0-9]|5[0-5]))\.){3}((1[0-9]|[1-9]?)[0-9]|2([0-4][0-9]|5[0-5]))$',
        re_bits_subnet = '(^3[012]$|^[12][0-9]$|^[0-9]$)';
    entry = text.split('/'),
        ip_addr = 2130706433,  // 127.0.0.1
        ip_mask = -16777216,  // 255.0.0.0
        stat = 0;  // 0: parsing OK; 1: error occurred

    if (new RegExp(re_ip_addr).exec(entry[0])){
        ip_addr = ipv4_dot2int(entry[0]);
    }
    else { stat = 1; }

    if (entry.length > 1){
        if (new RegExp(re_bits_subnet).exec(entry[1])){
            ip_mask = fill_mask(entry[1]);
        }
        else if (new RegExp(re_ip_addr).exec(entry[1])){
            ip_mask = ipv4_dot2int(entry[1]);
        }
        else {
            stat = 1;
            ip_mask = auto_mask(ip_addr);
        }
    }
    else {
        ip_mask = auto_mask(ip_addr);
    }

    return [ip_addr, ip_mask,
        get_wildcard(ip_mask),
        get_network(ip_addr, ip_mask),
        get_broadcast(ip_addr, ip_mask),
        get_first_host(ip_addr, ip_mask),
        get_last_host(ip_addr, ip_mask),
        get_number_hosts(ip_mask),
        ipv4_is_private(ip_addr),
        stat];
}

function dec2bin(n){
    /* Convert an n decimal integer to binary.  Returns a string. */

    var aux = 0
    ret = '';

    for (var i = 0; i < 4; i++){
        aux = (n & 255).toString(2);

        while (aux.length < 8){ aux = '0' + aux; }

        ret = aux + ' ' + ret;
        n = n >> 8;
    }

    return ret.slice(0, -1);
}


/**
 * CALLBACK FUNCTIONS
 */
function update_interface(p){
    if (p[9]){
        $('#input-ipmask').parent().addClass('has-error');
    }
    else{
        $('#input-ipmask').parent().removeClass('has-error');
    }


    for (var i = 0; i < 7; i++){
        $('#octet-' + i).text(ipv4_int2dot(p[i]));
    }
    $('#octet-7').text(p[7]);


    for (var i = 0; i < 7; i++){
        $('#octet-' + i + '-bin').text(dec2bin(p[i]));
    }
    $('#octet-7-bin').text(p[7].toString(2));

    if (p[8]){
        for (var i = 0; i < 8; i++){
            $('#span-' + i).addClass('label-danger');
        }
    }
    else{
        for (var i = 0; i < 8; i++){
            $('#span-' + i).removeClass('label-danger');
        }
    }


    $('#cmd').text('FOR /L %i IN ('+ ipv4_int2dot(p[5]+1).split('.').pop() +',1,'+ ipv4_int2dot(p[6]).split('.').pop() +') DO netsh interface ip add address \"Your_interface\" '+  ipv4_int2dot(p[6]).replace(/\.[0-9]{1,3}$/, "") + '.%i ' + ipv4_int2dot(p[1]) );
    $('#bash').text('for I in \$(seq '+ ipv4_int2dot(p[5]+1).split('.').pop() +' '+ ipv4_int2dot(p[6]).split('.').pop() +'); do nmcli con mod Your_interface +ipv4.addresses '+  ipv4_int2dot(p[6]).replace(/\.[0-9]{1,3}$/, "") + '.\${I}; done; \n\nnmcli con up Your_interface');
    $('#deb').text('interfaces=eno1; \nCLONENUM_STAR=0; \nfor I in \$(seq '+ ipv4_int2dot(p[5]+1).split('.').pop() +' '+ ipv4_int2dot(p[6]).split('.').pop() +'); do\ncat>/etc/network/interfaces.d/\${interfaces}:\${CLONENUM_STAR}<<EOF\nauto \${interfaces}:\${CLONENUM_STAR}\niface ${interfaces}:\${CLONENUM_STAR} inet static\naddress ' + ipv4_int2dot(p[6]).replace(/\.[0-9]{1,3}$/, "") + '.\$i\nnetmask ' + ipv4_int2dot(p[1]) +'\nEOF\ndone');

}

function on_input_enter(e){
    var p = [];

    if (e.keyCode == 13){
        p = parser($('#input-ipmask').val());
        console.log('tset',$('#input-ipmask').val());
        console.log('on_input_enter',p);
        update_interface(p);
    }
}

function on_uri_parameter(param){
    var p = parser(param);
    $('#input-ipmask').val(param);
    console.log('on_uri_parameter',p);
    update_interface(p);
}
function isValidIP(ip)
{
    //  var reg =  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/\d+$/g
    var reg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/\d+$/g


    return reg.test(ip);
}


function batch() {
    var cmd =[];
    var bash = [];
    var deb  =[];

    var name = $('#input-batch-name').val();
    console.log(name)
    if (name == '') {
        name ='Your_interface';
    }
    var ips = $('#input-batch').val().trim().split("\n");
    $('#cmd_batch').empty();
    $('#bash_batch').empty();
    $('#deb_batch').empty();
    $('#c6_batch').empty();

    $('#deb_batch').append('<pre>CLONENUM_STAR=0; #定义起始数</pre> ');
    $('#c6_batch').append('<pre>/etc/network/interfaces.d/'+name+' #定义起始数</pre> ');
    var i =0

    for (ket in ips) {
        if(isValidIP(ips[ket]))
        {
            var p = parser(ips[ket]);
            var vstartip = ipv4_int2dot(p[5]+1);
            var vendip = ipv4_int2dot(p[6]) ;
            var vmask = ipv4_int2dot(p[1]) ;

            $('#cmd_batch').append('<pre>'+'FOR /L %i IN ('+ ipv4_int2dot(p[5]+1).split('.').pop() +',1,'+ ipv4_int2dot(p[6]).split('.').pop() +') DO netsh interface ip add address \"'+name+'\" '+  ipv4_int2dot(p[6]).replace(/\.[0-9]{1,3}$/, "") + '.%i ' + ipv4_int2dot(p[1])+'</pre>' );
            $('#bash_batch').append('<pre>'+'for I in \$(seq '+ ipv4_int2dot(p[5]+1).split('.').pop() +' '+ ipv4_int2dot(p[6]).split('.').pop() +'); do nmcli con mod '+name+' +ipv4.addresses '+  ipv4_int2dot(p[6]).replace(/\.[0-9]{1,3}$/, "") + '.\${I}; done;'+'</pre>' );
            $('#deb_batch').append('<pre>iface eth0 inet static\n address '+ vstartip+'</pre>');
            //CLONENUM_STAR=`expr \$CLONENUM_STAR + '+ ipv4_int2dot(p[6]-p[5]).split('.').pop() +'`; \nfor I in \$(seq '+ ipv4_int2dot(p[5]+1).split('.').pop() +' '+ ipv4_int2dot(p[6]).split('.').pop() +'); do\ncat>/etc/network/interfaces.d/'+name+':\${CLONENUM_STAR}\<\< EOF\nauto '+name+':\${CLONENUM_STAR}\niface '+name+':\${CLONENUM_STAR} inet static\naddress ' + ipv4_int2dot(p[6]).replace(/\.[0-9]{1,3}$/, "") + '.\$i\nnetmask ' + ipv4_int2dot(p[1]) +'\nEOF\ndone'+'</pre>
            $('#c6_batch').append(' <pre>CLONENUM_STAR=`expr \$CLONENUM_STAR + '+ ipv4_int2dot(p[6]-p[5]).split('.').pop() +'`; \ncat>/etc/sysconfig/network-scripts/ifcfg-'+name+'-range'+i+' \<\< EOF \nDEVICE='+name+'  \nONBOOT=yes  \nBOOTPROTO=static \nCLONENUM_START=\${CLONENUM_STAR} \nIPADDR_START='+ vstartip +' \nIPADDR_END='+ vendip +' \nNETMASK='+ vmask +' \nARPCHECK=no \nEOF</pre>');

            var i = i +1;
        }
        else
        {
            $('#cmd_batch').append('<pre>#跳过'+ ips[ket] +'</pre>');
            $('#bash_batch').append('<pre>#跳过'+ ips[ket] +'</pre>' );
            $('#deb_batch').append('<pre>#跳过'+ ips[ket] +'</pre>' );
            $('#c6_batch').append('<pre>#跳过'+ ips[ket] +'</pre>' );
        }
    }
    $('#bash_batch').append('<pre>'+" nmcli con up "+name+""+'</pre>');


}

$(document).ready(function(){
    $('#input-ipmask').keypress(on_input_enter);

    if (window.location.search) {
        on_uri_parameter(window.location.search.replace(/^\?addr=/, ''));
    }
});
