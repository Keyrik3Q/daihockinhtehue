-user(id, idCompany, name, phone, cmnd, address, born)
-ticket(id, idCompany, idTrain, idTrip, idUser, numberSeat, isDebt[có nợ hay không], startDate, status[vé đã sử dụng hay chưa](0,1,2)(vé giử, vé đã mua, vé đã dùng), price, timeCheckIn, role[customer, traveler, boss])
-ticket(id, idCompany, idTrain, nametrain, idTrip, idUser, numberSeat, isDebt[có nợ hay không], startDate, status[vé đã sử dụng hay chưa](0,1,2)(vé giử, vé đã mua, vé đã dùng), price, timeCheckIn, role[customer, traveler, boss])
-train(id, name, totalSeat)
-debt(id, idCompany, idUser, idTicket, status, startDate, endDate, money)
-PayDebt(id, idDebt, idUser, startDate, money_spend, note)
-company(id, idParent, username, password, name, phone, born, address)
-PriceTicket(id, idCompany, idTrip, priceOrigin[giá vé công ty quy định cho đại lý], price)
//-trip(id, idCompany, idTrain, startDate, startTimeTrain, endTimeTrain, typeTicket=[vé ra hay vé vào])
-trip(id, idCompany, idTrain, startDate, startTimeTrain, endTimeTrain, typeTicket=[vé ra hay vé vào], priceOrigin[giá vé công ty quy định cho đại lý], price)
staff(id, idCompany, username, name, born, address)
status của seat sẽ reset vào 0 giờ hàng ngày	
point(id, idUser, coin)

bán vé
Quản lý Khách hàng
Quản lý vé
Thống kê vé bán
In vé đổi vé
Quản lý tàu
Quản lý đại lý ủy quyền
Quản lý chuyến tàu
Quản lý nợ
Tích điểm cho khách hàng
Quản lý nhân viên
Check in vé khi khách lên tàu
Thống kê lợi nhuận


https://www.callicoder.com/deploy-host-spring-boot-apps-on-heroku/

https://aws.amazon.com/getting-started/tutorials/create-connect-postgresql-db/
https://medium.com/agatha-codes/painless-postgresql-django-d4f03364989

https://github.com/luckycallor/InsightFace-tensorflow


SELECT ticket.*, train.*, user.* FROM herokuapp_Ticket ticket
INNER JOIN herokuapp_Train train on ticket.idTrain = train.id
INNER JOIN herokuapp_User user on ticket.idUser = user.id
WHERE ticket.idCompany = %s

['idTicket', 'trainName', 'name', 'numberSeat', 'startDate', 'startTimeTrain', 'endTimeTrain', 'status', 'price', 'timeCheckIn'];


{ "idTrain":1,"idTrip":1,"startDate":"2019-07-03"}
{"idTrain": 1, "idTrip": "1", "startDate": "2019-07-05", "typeTicket": "0"}
{ "username":"Phuong", "name": "le hong phuong", "born":"1993-07-09","address":"Đà Nẵng"}


Người cao tuoi la bao nhieu tuổi và giá giảm là bao nhiêu %
số ghế tàu là bao nhiêu hình dạng bố trí ghế tàu như thế nào
Giá tàu như thế nào
Các chuyến tàu như thế nào mấy giờ
Giá của các ghế trên tàu là giống nhau đúng ko





-bán vé => chọn tàu => chọn ngày => chọn giờ => load danh sách các seat còn trống * => giá của ghế sẽ load từ table PriceTicket => chọn vé để bán (Chỉ chọn được các vé chưa bán hoặc không phải đang vé) => khi chọn vé để thanh toán thì vé sẽ chuyễn trạng thái thành giữ trong(5 phút) * => điền thông tin của người mua vé *(Các khách đã từng mua vé tàu thì nhắc dựa vào thông tin sdt hoặc tên) => xử lý tính toán giá dựa vào năm sinh để biết miễn phí hay là giảm giá cho người già => insert data vào seat => => lấy ra lại id => tạo vé để print *

- Check in vé tàu khi khách lên tàu => Chọn chuyến tàu(Trước khi tàu chạy 1-> 2 ngày cần hỏi lại áp dụng online hay là tại văn phòng cũng thế)* => scan vé => nếu thông tin đúng => thì sẽ update status vé là đã check in (Chỉ check in 1 lần duy nhất) => nếu mà vé không đúng thì chỉ show thông tin vé đi ngày nào, hay vé hết hạn

- Quản Lý đại lý => tạo đại lý => xóa đại lý *(Cần xem xét vì nó sẽ ảnh hưởng đến thông tin người dùng) => chỉnh sửa thông tin và giá vé bán cho đại lý theo từng chuyến tàu[ra vào, thời gian] 

- Chỉnh sửa giá vé cho từng chuyến tàu của mình => chọn vé và edit giá vé bán dựa vào giá gốc
- Quản lý nhân viên => CRUD
- Quản lý khách hàng dựa vào thông tin mua vé
- Quản lý nợ vé => có thể tìm kiếm theo tên => trả nợ theo vé => hoặc có thể trả hết 1 lần nếu có nhiều vé *(Khi trả nhiều vé thì cần show thông tin là trả tổng cộng bao nhiêu tiền) => có thể lọc theo đã trả nợ hay chưa => có thể trả ít hoặc trả luôn 1 lúc => khi vé trả hết thì cần update vào ticket.idDebt = false để thống kê lợi nhuận

- Thống kê lợi nhận thì sẽ thống kê => theo tiền bán vé không tính nợ dựa vào ticket đã bán => có thể thống kê theo ngày => theo tuần => theo tháng => theo quý => theo năm => Thống kê các thông tin số lượng vé đã bán, tổng lợi nhuận, số lượng bán vé theo khung giờ nào nhiều=> phân tích để suggest giảm giá vé các chuyến tàu ít người đi hoặc thời điểm nào nhiều người đi

- Đổi vé => danh sách các vé đã đặt => tùy chọn các vé chưa check in => các vé còn hạn sử dụng => search vé theo name, sdt, cmnd => chọn đỗi vé vào ngày khác hoăc (giờ khác cần hỏi xem có được ko) => load ra danh sách seat trống để đổi => sẽ xóa vé cũ và tạo vé mới

- Hiện điểm đã tích tại mục thanh toán -> khi thanh toán thì 1 vé sẽ được cộng thêm 1 điểm -> kiểm tra user đã có record tích điểm chưa, nếu chưa có thì sẽ tự cộng thêm -> khi điểm tích được 100 thì sẽ được giảm 3%, 200 thì sẽ được giảm 5%, > 300 sẽ được giảm 7% => thực hiện trừ tiền lúc thanh toán luôn và ghi ra cho họ biết là giảm bao nhiêu

- Thêm 1 cờ để kiểm tra là hướng dẫn viên hay là xếp để note lên vé và giá vé sẽ được cập nhập ngay tại đó -> thêm 1 cờ để hiển thị role tại vé bán

- thêm chức năng search tích hợp => gồm có seach theo tên và search thêm thoe ngày và search thêm theo giờ để đổi vé => thêm list check box và 1 button để đẩy cái list để có thể update hoàng loạt giờ đi (Tạo 1 dialog sẽ update thông tin chung và sẽ thay đổi cho all luôn)

- mục bán vé tạo thêm 1 button để fill all thông tin lên các vé khác giống nhau trừ ghế thôi để có thể in vé theo đoàn

- 


- Phần tạo vé trực tiếp trên trang quản lý
- Phần thông tin bán vé từ đâu
- Phần thanh toán nợ

 
statistical
sellTicket
checkIn
agency
ticket
staff
user
debt
changeTicket


chọn hình thức thanh toán
	Tiền mặt hay quẹt thẻ
	
Xem thông tin của vé
	


https://www.npmjs.com/package/ngx-print 
https://github.com/mistryakshar54/angular-seat-charts

 

ng g module home-page --module app

ng g c home-page --module home-page

ng g c home-page/menu --module home-page 

ng g c home-page/footer --module home-page

ng g module home-page/content --module home-page 

ng g c home-page/content --module content

ng g module home-page/login --module home-page 

ng g c home-page/login --module login
  
ng g module home-page/content/home --module content

ng g module home-page/content/statistical --module content
ng g c home-page/content/statistical
  
ng g module home-page/content/sellTicket --module content
ng g c home-page/content/sellTicket
  
ng g module home-page/content/checkIn --module content
ng g c home-page/content/checkIn
  
ng g module home-page/content/agency --module content
ng g c home-page/content/agency
  
ng g module home-page/content/ticket --module content
ng g c home-page/content/ticket
  
ng g module home-page/content/staff --module content
ng g c home-page/content/staff
  
ng g module home-page/content/user --module content
ng g c home-page/content/user
  
ng g module home-page/content/debt --module content
ng g c home-page/content/debt
  
ng g module home-page/content/changeTicket --module content
ng g c home-page/content/changeTicket

ng g module home-page/content/train --module content
ng g c home-page/content/train

ng g module home-page/content/trip --module content
ng g c home-page/content/trip
  
ng g module home-page/content/xxx --module content
ng g c home-page/content/xxx
  
ng g module home-page/content/xxx --module content
ng g c home-page/content/xxx
  

  
  
Hỗ trợ trẻ em học học tập bằng giọng nói nó thể tự đặt các câu hỏi dựa vào số tuổi của bé cho phù hợp hoặc trả lời các câu hỏi của bé
(Các phụ huynh nào ít có thời gian trả lời các câu hỏi của con thì có thể dùng nó) nó trả lời các câu hỏi theo các chủ để khác nhau trước mắt sẽ train cho nó chủ đề toán học, 10 vạn câu hỏi vì sao, tiếng anh


tainm
6MA6i8EKcwpVbX4 
 

Quản lý vé:
	Thêm ngày để lọc data
	Thêm check box để có thể in vé hoàng loạt
	
	
 
 

 
 

 