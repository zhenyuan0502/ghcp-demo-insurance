export type Language = 'vi' | 'en';

export interface Translations {
  common: {
    currency: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    save: string;
  };
  navbar: {
    title: string;
    home: string;
    quote: string;
    dashboard: string;
    switchToDark: string;
    switchToLight: string;
    switchToVietnamese: string;
    switchToEnglish: string;
  };
  home: {
    title: string;
    subtitle: string;
    getQuoteButton: string;
    lifeInsurance: {
      title: string;
      description: string;
    };
    autoInsurance: {
      title: string;
      description: string;
    };
    homeInsurance: {
      title: string;
      description: string;
    };
  };
  quote: {
    title: string;
    productType: string;
    purchaserInfo: string;
    insuredInfo: string;
    sameAsInsured: string;
    gender: string;
    age: string;
    occupation: string;
    paymentYears: string;
    monthlyPremium: string;
    yearlyPremium: string;
    insuranceAmount: string;
    submitButton: string;
    validation: {
      selectProduct: string;
      enterGender: string;
      enterAge: string;
      enterOccupation: string;
      enterAmount: string;
      enterMonthlyPremium: string;
      enterYearlyPremium: string;
    };
    notifications: {
      submitSuccess: string;
      submitError: string;
    };
  };
  dashboard: {
    title: string;
    actions: string;
    totalQuotes: string;
    pendingQuotes: string;
    approvedQuotes: string;
    status: {
      pending: string;
      approved: string;
      rejected: string;
      expired: string;
      unknown: string;
    };
    statusActions: {
      approve: string;
      reject: string;
      markPending: string;
    };
    notifications: {
      updateSuccess: string;
      updateError: string;
      deleteSuccess: string;
      deleteError: string;
    };
    deleteDialog: {
      title: string;
      message: string;
    };
  };
  insuranceTypes: {
    health: string;
    life: string;
    auto: string;
    home: string;
    travel: string;
    other: string;
  };
}

export const translations: Record<Language, Translations> = {
  vi: {
    common: {
      currency: 'VND',
      loading: 'Đang tải...',
      error: 'Lỗi',
      success: 'Thành công',
      cancel: 'Hủy',
      confirm: 'Xác nhận',
      delete: 'Xóa',
      edit: 'Sửa',
      save: 'Lưu',
    },
    navbar: {
      title: 'Bảo Hiểm An Toàn',
      home: 'Trang Chủ',
      quote: 'Báo Giá',
      dashboard: 'Bảng Điều Khiển',
      switchToDark: 'Chuyển sang chế độ tối',
      switchToLight: 'Chuyển sang chế độ sáng',
      switchToVietnamese: 'Chuyển sang tiếng Việt',
      switchToEnglish: 'Chuyển sang tiếng Anh',
    },
    home: {
      title: 'Chào Mừng Đến Với Bảo Hiểm An Toàn',
      subtitle: 'Đối tác tin cậy cho các giải pháp bảo hiểm toàn diện',
      getQuoteButton: 'Nhận Báo Giá Miễn Phí',
      lifeInsurance: {
        title: 'Bảo Hiểm Nhân Thọ',
        description: 'Bảo vệ tương lai tài chính của gia đình bạn',
      },
      autoInsurance: {
        title: 'Bảo Hiểm Ô Tô',
        description: 'Bảo hiểm toàn diện cho xe của bạn',
      },
      homeInsurance: {
        title: 'Bảo Hiểm Nhà Ở',
        description: 'Bảo vệ ngôi nhà và tài sản của bạn',
      },
    },
    quote: {
      title: 'Báo Giá Bảo Hiểm',
      productType: 'Loại sản phẩm',
      purchaserInfo: 'Thông tin Bên mua bảo hiểm',
      insuredInfo: 'Bên được bảo hiểm',
      sameAsInsured: 'Thông tin Bên mua bảo hiểm & Bên được bao hiểm giống nhau:',
      gender: 'Giới tính',
      age: 'Tuổi',
      occupation: 'Nghề nghiệp',
      paymentYears: 'Số năm đóng',
      monthlyPremium: 'Phí hàng tháng',
      yearlyPremium: 'Phí hàng năm',
      insuranceAmount: 'Số tiền bảo hiểm',
      submitButton: 'Gửi Yêu Cầu Báo Giá',
      validation: {
        selectProduct: 'Vui lòng chọn loại sản phẩm.',
        enterGender: 'Vui lòng nhập giới tính.',
        enterAge: 'Vui lòng nhập tuổi.',
        enterOccupation: 'Vui lòng nhập nghề nghiệp.',
        enterAmount: 'Vui lòng nhập số tiền bảo hiểm.',
        enterMonthlyPremium: 'Vui lòng nhập phí hàng tháng.',
        enterYearlyPremium: 'Vui lòng nhập phí hàng năm.',
      },
      notifications: {
        submitSuccess: 'Gửi yêu cầu báo giá thành công',
        submitError: 'Có lỗi xảy ra khi gửi yêu cầu báo giá',
      },
    },
    dashboard: {
      title: 'Bảng Điều Khiển',
      actions: 'Hành động',
      totalQuotes: 'Tổng Báo Giá',
      pendingQuotes: 'Báo Giá Chờ Duyệt',
      approvedQuotes: 'Báo Giá Đã Duyệt',
      status: {
        pending: 'Chờ duyệt',
        approved: 'Đã duyệt',
        rejected: 'Từ chối',
        expired: 'Hết hạn',
        unknown: 'Không xác định',
      },
      statusActions: {
        approve: 'Duyệt',
        reject: 'Từ chối',
        markPending: 'Chờ duyệt',
      },
      notifications: {
        updateSuccess: 'Cập nhật trạng thái thành công',
        updateError: 'Có lỗi xảy ra khi cập nhật trạng thái',
        deleteSuccess: 'Xóa báo giá thành công',
        deleteError: 'Có lỗi xảy ra khi xóa báo giá',
      },
      deleteDialog: {
        title: 'Xác nhận xóa',
        message: 'Bạn có chắc chắn muốn xóa báo giá này không?',
      },
    },
    insuranceTypes: {
      health: 'Sức khỏe',
      life: 'Nhân thọ',
      auto: 'Xe cộ',
      home: 'Nhà ở',
      travel: 'Du lịch',
      other: 'Khác',
    },
  },
  en: {
    common: {
      currency: 'VND',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
    },
    navbar: {
      title: 'Safe Insurance',
      home: 'Home',
      quote: 'Quote',
      dashboard: 'Dashboard',
      switchToDark: 'Switch to dark mode',
      switchToLight: 'Switch to light mode',
      switchToVietnamese: 'Switch to Vietnamese',
      switchToEnglish: 'Switch to English',
    },
    home: {
      title: 'Welcome to Safe Insurance',
      subtitle: 'Your trusted partner for comprehensive insurance solutions',
      getQuoteButton: 'Get Free Quote',
      lifeInsurance: {
        title: 'Life Insurance',
        description: 'Protect your family\'s financial future',
      },
      autoInsurance: {
        title: 'Auto Insurance',
        description: 'Comprehensive coverage for your vehicle',
      },
      homeInsurance: {
        title: 'Home Insurance',
        description: 'Protect your home and belongings',
      },
    },
    quote: {
      title: 'Insurance Quote',
      productType: 'Product Type',
      purchaserInfo: 'Purchaser Information',
      insuredInfo: 'Insured Person',
      sameAsInsured: 'Purchaser and Insured Person information are the same:',
      gender: 'Gender',
      age: 'Age',
      occupation: 'Occupation',
      paymentYears: 'Payment Years',
      monthlyPremium: 'Monthly Premium',
      yearlyPremium: 'Yearly Premium',
      insuranceAmount: 'Insurance Amount',
      submitButton: 'Submit Quote Request',
      validation: {
        selectProduct: 'Please select a product type.',
        enterGender: 'Please enter gender.',
        enterAge: 'Please enter age.',
        enterOccupation: 'Please enter occupation.',
        enterAmount: 'Please enter insurance amount.',
        enterMonthlyPremium: 'Please enter monthly premium.',
        enterYearlyPremium: 'Please enter yearly premium.',
      },
      notifications: {
        submitSuccess: 'Quote request submitted successfully',
        submitError: 'An error occurred while submitting quote request',
      },
    },
    dashboard: {
      title: 'Dashboard',
      actions: 'Actions',
      totalQuotes: 'Total Quotes',
      pendingQuotes: 'Pending Quotes',
      approvedQuotes: 'Approved Quotes',
      status: {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        expired: 'Expired',
        unknown: 'Unknown',
      },
      statusActions: {
        approve: 'Approve',
        reject: 'Reject',
        markPending: 'Mark Pending',
      },
      notifications: {
        updateSuccess: 'Status updated successfully',
        updateError: 'An error occurred while updating status',
        deleteSuccess: 'Quote deleted successfully',
        deleteError: 'An error occurred while deleting quote',
      },
      deleteDialog: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this quote?',
      },
    },
    insuranceTypes: {
      health: 'Health',
      life: 'Life',
      auto: 'Auto',
      home: 'Home',
      travel: 'Travel',
      other: 'Other',
    },
  },
};

export const getTranslations = (language: Language): Translations => {
  return translations[language];
};