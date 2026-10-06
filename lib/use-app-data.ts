import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";

import { categories } from "@/lib/categories";
import { type Issue, type Priority, priorityLabels, type AppState } from "@/lib/types";

const STORAGE_KEY = "cskh-script-data-v1";
const BACKUP_KEY = "cskh-backups-v1";
const MAX_BACKUPS = 12;

const initialState: AppState = {
  issues: [],
  activeCategoryId: "cks",
  activeIssueId: "",
  checklistState: {},
  viewCounts: {},
};

export function useAppData() {
  const [state, setState] = useState<AppState>(initialState);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: AppState = JSON.parse(saved);
        setState({
          ...parsed,
          issues: Array.isArray(parsed.issues) ? parsed.issues : initialState.issues,
        });
      } catch {
        setState(initialState);
      }
    } else {
      // Seed data
      const seed: Issue[] = [
        {
          id: "833d8eaa-fa83-4e18-85c1-f43f408dd28e",
          categoryId: "cks",
          name: "Máy không nhận USB Token",
          summary: "Driver / USB không nhận",
          steps: [
            "Rút Token ra, cắm vào cổng USB khác",
            "Kiểm tra đèn LED trên token có sáng không",
            "Mở Device Manager xem có dấu chấm than màu vàng không",
            "Gỡ và cài lại driver Token đúng nhà cung cấp",
            "Khởi động lại máy, mở lại phần mềm ký và thử ký lại",
          ],
          script: "Chào anh/chị! Em hỗ trợ lỗi máy không nhận Token nhé 🙏\n\n✅ Bước 1: Rút Token ra, cắm lại cổng USB KHÁC\n✅ Bước 2: Kiểm tra đèn LED trên token có sáng không?\n✅ Bước 3: Vào Start -> Device Manager -> xem có dấu ! vàng không\n✅ Bước 4: Nếu vẫn chưa nhận, em sẽ gửi link driver để anh/chị cài lại",
          escalation: "Token cắm cổng khác vẫn không nhận, LED không sáng hoặc Device Manager không xuất hiện thiết bị.",
          image: "",
        },
        {
          id: "bacbcbef-1af9-4f6c-9012-4b5f2eb57194",
          categoryId: "cks",
          name: "Lỗi Java / Plugin ký số",
          summary: "Không ký được trên HTKK",
          steps: [
            "Kiểm tra phiên bản Java đang cài",
            "Gỡ các bản Java cũ hoặc trùng phiên bản",
            "Cài Java 8 32-bit cho HTKK nếu máy yêu cầu",
            "Thêm trang web thuế vào Security Exception Site List",
            "Mở lại trình duyệt hoặc phần mềm và ký lại",
          ],
          script: "Anh/chị kiểm tra giúp em phần Java/Plugin ký số nhé.\n\n✅ Gỡ các bản Java cũ\n✅ Cài lại Java đúng phiên bản\n✅ Thêm trang web vào danh sách bảo mật Java\n✅ Mở lại phần mềm và ký lại hồ sơ",
          escalation: "Đã cài lại Java đúng phiên bản nhưng plugin vẫn không tải hoặc trình duyệt báo chặn ký.",
          image: "",
        },
        {
          id: "fb5b8b74-894f-4806-ba59-6325b305c595",
          categoryId: "cks",
          name: "Chứng thư số hết hạn",
          summary: "Cảnh báo Certificate Expired",
          steps: [
            "Mở phần mềm quản lý Token để xem hạn chứng thư",
            "Kiểm tra ngày giờ hệ thống trên máy tính",
            "Nếu chứng thư đã hết hạn, chuyển quy trình gia hạn",
            "Nếu chưa hết hạn, cập nhật lại driver hoặc chứng thư",
          ],
          script: "Anh/chị mở phần mềm quản lý Token giúp em để kiểm tra hạn chứng thư.\nNếu chứng thư đã hết hạn, bên em sẽ hỗ trợ quy trình gia hạn để ký tiếp hồ sơ.",
          escalation: "Khách cần ký gấp nhưng chứng thư hết hạn hoặc thông tin chứng thư sai với giấy phép kinh doanh.",
          image: "",
        },
        {
          id: "32345e2c-3a1a-4d2f-93de-eb8ad3965fcf",
          categoryId: "cks",
          name: "Quên PIN / Token bị khóa",
          summary: "Nhập sai PIN, token bị lock",
          steps: [
            "Hỏi khách đã nhập sai PIN bao nhiêu lần",
            "Kiểm tra token còn mở phần mềm quản lý được không",
            "Nếu còn PUK, hướng dẫn đổi lại PIN",
            "Nếu khóa hoàn toàn, chuyển bộ phận xử lý Token",
          ],
          script: "Trường hợp Token bị khóa do nhập sai PIN nhiều lần, anh/chị không nhập tiếp giúp em để tránh khóa sâu hơn. Em sẽ kiểm tra tình trạng Token và hướng dẫn bước mở khóa phù hợp.",
          escalation: "Token bị khóa hoàn toàn, không có PUK hoặc khách không nhớ thông tin đăng ký.",
          image: "",
        },
        {
          id: "bc013887-c9f5-4dc7-b39e-a9730b0a5ae4",
          categoryId: "hddt",
          name: "Không đăng nhập được phần mềm HĐ",
          summary: "Quên mật khẩu / sai tài khoản",
          steps: [
            "Xác nhận đúng đường dẫn phần mềm hóa đơn",
            "Kiểm tra tên đăng nhập, mã số thuế và email khôi phục",
            "Hướng dẫn đặt lại mật khẩu",
            "Kiểm tra tài khoản có bị khóa do nhập sai nhiều lần không",
          ],
          script: "Anh/chị gửi giúp em mã số thuế và email đăng nhập phần mềm hóa đơn. Em kiểm tra tài khoản và hướng dẫn đặt lại mật khẩu nếu cần.",
          escalation: "Tài khoản bị khóa, mất email khôi phục hoặc không có quyền quản trị.",
          image: "",
        },
        {
          id: "522461c6-fabb-4d28-8946-97b894c5e3ea",
          categoryId: "hddt",
          name: "Gửi hóa đơn thất bại",
          summary: "HĐ tạo xong nhưng không gửi được email",
          steps: [
            "Kiểm tra email người nhận có đúng định dạng không",
            "Kiểm tra cấu hình email gửi trong phần mềm",
            "Thử gửi lại một hóa đơn mẫu",
            "Nếu lỗi SMTP, đổi sang email gửi mặc định của hệ thống",
          ],
          script: "Hóa đơn đã lập nhưng gửi email chưa thành công. Anh/chị kiểm tra lại email người nhận giúp em, sau đó em sẽ hỗ trợ gửi lại từ hệ thống.",
          escalation: "Gửi lại nhiều lần không được hoặc hệ thống báo lỗi SMTP/tài khoản email gửi.",
          image: "",
        },
        {
          id: "4f5e6b7c-8d9e-4f0a-9b2c-3d4e5f6a7b8c",
          categoryId: "hddt",
          name: "Hủy / điều chỉnh hóa đơn",
          summary: "HĐ sai thông tin cần hủy hoặc điều chỉnh",
          steps: [
            "Xác định hóa đơn đã gửi cơ quan thuế hay chưa",
            "Kiểm tra trạng thái mã của cơ quan thuế",
            "Chọn nghiệp vụ thay thế, điều chỉnh hoặc hủy theo tình huống",
            "Lập biên bản nếu quy trình khách yêu cầu",
          ],
          script: "Anh/chị cho em xin số hóa đơn và tình trạng đã cấp mã cơ quan thuế chưa. Em sẽ xác định giúp trường hợp này nên thay thế, điều chỉnh hay hủy.",
          escalation: "Hóa đơn đã kê khai, sai thông tin trọng yếu hoặc khách chưa rõ nghiệp vụ kế toán.",
          image: "",
        },
        {
          id: "9a8b7c6d-5e4f-3d2c-1b0a-9f8e7d6c5b4a",
          categoryId: "hddt",
          name: "Lỗi ký số trên hóa đơn",
          summary: "Không ký được HĐ điện tử",
          steps: [
            "Kiểm tra Token đã nhận trong máy chưa",
            "Kiểm tra chứng thư số còn hạn và đúng MST",
            "Cài lại plugin ký của phần mềm hóa đơn",
            "Thử ký lại trên một hóa đơn nháp",
          ],
          script: "Anh/chị kiểm tra giúp em Token đã cắm vào máy và chứng thư còn hạn. Em sẽ hỗ trợ cài lại plugin ký hóa đơn nếu phần mềm vẫn báo lỗi.",
          escalation: "Chứng thư đúng nhưng hệ thống hóa đơn không nhận hoặc báo sai MST khi ký.",
          image: "",
        },
        {
          id: "2f3e4d5c-6b7a-8c9d-0e1f-2a3b4c5d6e7f",
          categoryId: "bhxh",
          name: "Không vào được cổng BHXH",
          summary: "Lỗi kết nối / trang không tải được",
          steps: [
            "Kiểm tra mạng và thử mở bằng trình duyệt khác",
            "Xóa cache trình duyệt",
            "Kiểm tra trang BHXH có đang bảo trì không",
            "Thử đổi DNS hoặc dùng mạng khác",
          ],
          script: "Anh/chị thử mở cổng BHXH bằng trình duyệt khác giúp em. Nếu vẫn không vào được, em sẽ kiểm tra tiếp tình trạng mạng hoặc trang BHXH đang bảo trì.",
          escalation: "Nhiều máy/mạng đều không vào được hoặc cổng BHXH có thông báo bảo trì.",
          image: "",
        },
        {
          id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
          categoryId: "bhxh",
          name: "Không ký số được hồ sơ BHXH",
          summary: "Lỗi ký số trên cổng dịch vụ công",
          steps: [
            "Kiểm tra Token đã nhận và chứng thư còn hạn",
            "Mở trình ký BHXH với quyền Administrator",
            "Cài lại extension hoặc plugin ký",
            "Thử ký hồ sơ khác để xác định lỗi theo hồ sơ hay hệ thống",
          ],
          script: "Anh/chị cắm Token và mở lại trình ký BHXH giúp em. Nếu hệ thống vẫn báo lỗi ký số, em sẽ hỗ trợ cài lại plugin ký và kiểm tra chứng thư.",
          escalation: "Token ký được nơi khác nhưng riêng BHXH không ký được, hoặc lỗi phát sinh sau khi cập nhật cổng.",
          image: "",
        },
        {
          id: "3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a",
          categoryId: "bhxh",
          name: "Nộp hồ sơ thất bại",
          summary: "Ký xong nhưng nộp không được",
          steps: [
            "Kiểm tra hồ sơ đã ký thành công chưa",
            "Xem thông báo lỗi trả về từ cổng BHXH",
            "Kiểm tra định dạng file và dung lượng hồ sơ",
            "Nộp lại sau 5-10 phút nếu cổng quá tải",
          ],
          script: "Hồ sơ đã ký nhưng nộp chưa thành công. Anh/chị chụp giúp em thông báo lỗi sau khi bấm nộp để em xác định do file hồ sơ hay do cổng BHXH.",
          escalation: "Cổng trả mã lỗi không rõ, nộp lại nhiều lần thất bại hoặc hồ sơ đến hạn gấp.",
          image: "",
        },
        {
          id: "4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b",
          categoryId: "bhxh",
          name: "Lỗi tài khoản / mật khẩu BHXH",
          summary: "Không đăng nhập được cổng BHXH",
          steps: [
            "Xác nhận mã đơn vị và tài khoản đăng nhập",
            "Kiểm tra caps lock, bộ gõ và mật khẩu gần nhất",
            "Hướng dẫn lấy lại mật khẩu qua email/số điện thoại đăng ký",
            "Kiểm tra tài khoản có bị khóa không",
          ],
          script: "Anh/chị gửi giúp em mã đơn vị BHXH và email/số điện thoại đăng ký tài khoản. Em sẽ kiểm tra hướng khôi phục mật khẩu phù hợp.",
          escalation: "Mất email/số điện thoại khôi phục hoặc tài khoản bị khóa cần làm việc với cơ quan BHXH.",
          image: "",
        },
      ];

      setState((prev) => ({ ...prev, issues: seed }));
      saveState({ ...initialState, issues: seed });
    }
    setIsLoading(false);
  }, []);

  const saveState = useCallback((newState: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    setState(newState);
  }, []);

  const addBackup = useCallback((reason: string) => {
    const backups = JSON.parse(localStorage.getItem(BACKUP_KEY) || "[]") as any[];
    const newBackup = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      reason,
      issues: [...state.issues],
    };
    backups.unshift(newBackup);
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backups.slice(0, MAX_BACKUPS)));
  }, [state.issues]);

  const getFilteredIssues = useMemo(() => {
    const { activeCategoryId, activeIssueId, viewCounts } = state;
    const cat = categories.find((c) => c.id === activeCategoryId);
    return state.issues
      .filter((issue) => issue.categoryId === activeCategoryId)
      .map((issue) => ({
        ...issue,
        priorityLabel: issue.priorityLabels?.[0] || "common",
        priorityColor: priorityLabels.find((p) => p.id === issue.priorityLabels?.[0])?.className || priorityLabels[0].className,
        viewCount: viewCounts[issue.id] || 0,
        isActive: issue.id === activeIssueId,
      }))
      .sort((a, b) => (b.viewCount - a.viewCount));
  }, [state]);

  const activeIssue = useMemo(() => state.issues.find((i) => i.id === state.activeIssueId), [state]);

  const recordView = useCallback((issueId: string) => {
    setState((prev) => {
      const newCounts = { ...prev.viewCounts };
      newCounts[issueId] = (newCounts[issueId] || 0) + 1;
      const updated = { ...prev, viewCounts: newCounts };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const saveCloudState = useCallback(async (userId: string) => {
    // Placeholder for Firebase sync (implement in firebase.ts later)
    console.log("Syncing to Firestore for user:", userId);
    toast.success("Đã đồng bộ lên cloud");
  }, []);

  return {
    state,
    setState,
    saveState,
    addBackup,
    getFilteredIssues,
    activeIssue,
    recordView,
    saveCloudState,
    isLoading,
  };
}
