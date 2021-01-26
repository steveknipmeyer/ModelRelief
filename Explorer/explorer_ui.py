# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'Explorer/explorer.ui'
#
# Created by: PyQt5 UI code generator 5.15.2
#
# WARNING: Any manual changes made to this file will be lost when pyuic5 is
# run again.  Do not edit this file unless you know what you are doing.


from PyQt5 import QtCore, QtGui, QtWidgets


class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(1171, 967)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.MinimumExpanding, QtWidgets.QSizePolicy.MinimumExpanding)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(MainWindow.sizePolicy().hasHeightForWidth())
        MainWindow.setSizePolicy(sizePolicy)
        MainWindow.setMinimumSize(QtCore.QSize(0, 0))
        icon = QtGui.QIcon()
        icon.addPixmap(QtGui.QPixmap(":/Explorer/gradient.png"), QtGui.QIcon.Normal, QtGui.QIcon.Off)
        MainWindow.setWindowIcon(icon)
        self.centralWidget = QtWidgets.QWidget(MainWindow)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Preferred)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.centralWidget.sizePolicy().hasHeightForWidth())
        self.centralWidget.setSizePolicy(sizePolicy)
        self.centralWidget.setFocusPolicy(QtCore.Qt.NoFocus)
        self.centralWidget.setObjectName("centralWidget")
        self.gridLayout_2 = QtWidgets.QGridLayout(self.centralWidget)
        self.gridLayout_2.setObjectName("gridLayout_2")
        self.overallTabsContainer = QtWidgets.QTabWidget(self.centralWidget)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Expanding)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.overallTabsContainer.sizePolicy().hasHeightForWidth())
        self.overallTabsContainer.setSizePolicy(sizePolicy)
        self.overallTabsContainer.setMinimumSize(QtCore.QSize(0, 0))
        self.overallTabsContainer.setBaseSize(QtCore.QSize(0, 0))
        font = QtGui.QFont()
        font.setPointSize(12)
        self.overallTabsContainer.setFont(font)
        self.overallTabsContainer.setFocusPolicy(QtCore.Qt.NoFocus)
        self.overallTabsContainer.setTabPosition(QtWidgets.QTabWidget.East)
        self.overallTabsContainer.setObjectName("overallTabsContainer")
        self.imageTabsContainer = QtWidgets.QWidget()
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Expanding)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.imageTabsContainer.sizePolicy().hasHeightForWidth())
        self.imageTabsContainer.setSizePolicy(sizePolicy)
        self.imageTabsContainer.setFocusPolicy(QtCore.Qt.NoFocus)
        self.imageTabsContainer.setObjectName("imageTabsContainer")
        self.gridLayout = QtWidgets.QGridLayout(self.imageTabsContainer)
        self.gridLayout.setObjectName("gridLayout")
        self.imageTabs = QtWidgets.QTabWidget(self.imageTabsContainer)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Expanding)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.imageTabs.sizePolicy().hasHeightForWidth())
        self.imageTabs.setSizePolicy(sizePolicy)
        font = QtGui.QFont()
        font.setPointSize(12)
        self.imageTabs.setFont(font)
        self.imageTabs.setFocusPolicy(QtCore.Qt.StrongFocus)
        self.imageTabs.setObjectName("imageTabs")
        self.depthBufferTab = QtWidgets.QWidget()
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Preferred, QtWidgets.QSizePolicy.Preferred)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.depthBufferTab.sizePolicy().hasHeightForWidth())
        self.depthBufferTab.setSizePolicy(sizePolicy)
        self.depthBufferTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.depthBufferTab.setObjectName("depthBufferTab")
        self.verticalLayout_2 = QtWidgets.QVBoxLayout(self.depthBufferTab)
        self.verticalLayout_2.setObjectName("verticalLayout_2")
        self.imageTabs.addTab(self.depthBufferTab, "")
        self.reliefTab = QtWidgets.QWidget()
        self.reliefTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.reliefTab.setObjectName("reliefTab")
        self.verticalLayout_9 = QtWidgets.QVBoxLayout(self.reliefTab)
        self.verticalLayout_9.setObjectName("verticalLayout_9")
        self.imageTabs.addTab(self.reliefTab, "")
        self.backgroundMaskTab = QtWidgets.QWidget()
        self.backgroundMaskTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.backgroundMaskTab.setObjectName("backgroundMaskTab")
        self.verticalLayout_3 = QtWidgets.QVBoxLayout(self.backgroundMaskTab)
        self.verticalLayout_3.setObjectName("verticalLayout_3")
        self.imageTabs.addTab(self.backgroundMaskTab, "")
        self.gradientXTab = QtWidgets.QWidget()
        self.gradientXTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.gradientXTab.setObjectName("gradientXTab")
        self.verticalLayout_4 = QtWidgets.QVBoxLayout(self.gradientXTab)
        self.verticalLayout_4.setObjectName("verticalLayout_4")
        self.imageTabs.addTab(self.gradientXTab, "")
        self.gradientXMaskTab = QtWidgets.QWidget()
        self.gradientXMaskTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.gradientXMaskTab.setObjectName("gradientXMaskTab")
        self.verticalLayout_5 = QtWidgets.QVBoxLayout(self.gradientXMaskTab)
        self.verticalLayout_5.setObjectName("verticalLayout_5")
        self.imageTabs.addTab(self.gradientXMaskTab, "")
        self.gradientYTab = QtWidgets.QWidget()
        self.gradientYTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.gradientYTab.setObjectName("gradientYTab")
        self.verticalLayout_6 = QtWidgets.QVBoxLayout(self.gradientYTab)
        self.verticalLayout_6.setObjectName("verticalLayout_6")
        self.imageTabs.addTab(self.gradientYTab, "")
        self.gradientYMaskTab = QtWidgets.QWidget()
        self.gradientYMaskTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.gradientYMaskTab.setObjectName("gradientYMaskTab")
        self.verticalLayout_7 = QtWidgets.QVBoxLayout(self.gradientYMaskTab)
        self.verticalLayout_7.setObjectName("verticalLayout_7")
        self.imageTabs.addTab(self.gradientYMaskTab, "")
        self.compositeMaskTab = QtWidgets.QWidget()
        self.compositeMaskTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.compositeMaskTab.setObjectName("compositeMaskTab")
        self.verticalLayout_8 = QtWidgets.QVBoxLayout(self.compositeMaskTab)
        self.verticalLayout_8.setObjectName("verticalLayout_8")
        self.imageTabs.addTab(self.compositeMaskTab, "")
        self.gradientXUnsharpTab = QtWidgets.QWidget()
        self.gradientXUnsharpTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.gradientXUnsharpTab.setObjectName("gradientXUnsharpTab")
        self.verticalLayout = QtWidgets.QVBoxLayout(self.gradientXUnsharpTab)
        self.verticalLayout.setObjectName("verticalLayout")
        self.imageTabs.addTab(self.gradientXUnsharpTab, "")
        self.gradientYUnsharpTab = QtWidgets.QWidget()
        self.gradientYUnsharpTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.gradientYUnsharpTab.setObjectName("gradientYUnsharpTab")
        self.verticalLayout_11 = QtWidgets.QVBoxLayout(self.gradientYUnsharpTab)
        self.verticalLayout_11.setObjectName("verticalLayout_11")
        self.imageTabs.addTab(self.gradientYUnsharpTab, "")
        self.gridLayout.addWidget(self.imageTabs, 0, 1, 1, 1)
        self.overallTabsContainer.addTab(self.imageTabsContainer, "")
        self.modelTabsContainer = QtWidgets.QWidget()
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Expanding)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.modelTabsContainer.sizePolicy().hasHeightForWidth())
        self.modelTabsContainer.setSizePolicy(sizePolicy)
        font = QtGui.QFont()
        font.setPointSize(12)
        self.modelTabsContainer.setFont(font)
        self.modelTabsContainer.setFocusPolicy(QtCore.Qt.NoFocus)
        self.modelTabsContainer.setObjectName("modelTabsContainer")
        self.gridLayout_3 = QtWidgets.QGridLayout(self.modelTabsContainer)
        self.gridLayout_3.setObjectName("gridLayout_3")
        self.modelTabs = QtWidgets.QTabWidget(self.modelTabsContainer)
        self.modelTabs.setFocusPolicy(QtCore.Qt.NoFocus)
        self.modelTabs.setObjectName("modelTabs")
        self.modelMeshTab = QtWidgets.QWidget()
        self.modelMeshTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.modelMeshTab.setObjectName("modelMeshTab")
        self.verticalLayout_10 = QtWidgets.QVBoxLayout(self.modelMeshTab)
        self.verticalLayout_10.setObjectName("verticalLayout_10")
        self.modelTabs.addTab(self.modelMeshTab, "")
        self.modelMeshScaledTab = QtWidgets.QWidget()
        self.modelMeshScaledTab.setObjectName("modelMeshScaledTab")
        self.verticalLayout_13 = QtWidgets.QVBoxLayout(self.modelMeshScaledTab)
        self.verticalLayout_13.setObjectName("verticalLayout_13")
        self.modelTabs.addTab(self.modelMeshScaledTab, "")
        self.reliefMeshTab = QtWidgets.QWidget()
        self.reliefMeshTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.reliefMeshTab.setObjectName("reliefMeshTab")
        self.verticalLayout_12 = QtWidgets.QVBoxLayout(self.reliefMeshTab)
        self.verticalLayout_12.setObjectName("verticalLayout_12")
        self.modelTabs.addTab(self.reliefMeshTab, "")
        self.gridLayout_3.addWidget(self.modelTabs, 0, 0, 1, 1)
        self.overallTabsContainer.addTab(self.modelTabsContainer, "")
        self.workbenchTabsContainer = QtWidgets.QWidget()
        self.workbenchTabsContainer.setObjectName("workbenchTabsContainer")
        self.gridLayout_4 = QtWidgets.QGridLayout(self.workbenchTabsContainer)
        self.gridLayout_4.setObjectName("gridLayout_4")
        self.workbenchTabs = QtWidgets.QTabWidget(self.workbenchTabsContainer)
        self.workbenchTabs.setObjectName("workbenchTabs")
        self.i1Tab = QtWidgets.QWidget()
        self.i1Tab.setObjectName("i1Tab")
        self.verticalLayout_14 = QtWidgets.QVBoxLayout(self.i1Tab)
        self.verticalLayout_14.setObjectName("verticalLayout_14")
        self.workbenchTabs.addTab(self.i1Tab, "")
        self.i2Tab = QtWidgets.QWidget()
        self.i2Tab.setObjectName("i2Tab")
        self.verticalLayout_15 = QtWidgets.QVBoxLayout(self.i2Tab)
        self.verticalLayout_15.setObjectName("verticalLayout_15")
        self.workbenchTabs.addTab(self.i2Tab, "")
        self.i3Tab = QtWidgets.QWidget()
        self.i3Tab.setObjectName("i3Tab")
        self.verticalLayout_16 = QtWidgets.QVBoxLayout(self.i3Tab)
        self.verticalLayout_16.setObjectName("verticalLayout_16")
        self.workbenchTabs.addTab(self.i3Tab, "")
        self.i4Tab = QtWidgets.QWidget()
        self.i4Tab.setObjectName("i4Tab")
        self.verticalLayout_17 = QtWidgets.QVBoxLayout(self.i4Tab)
        self.verticalLayout_17.setObjectName("verticalLayout_17")
        self.workbenchTabs.addTab(self.i4Tab, "")
        self.i5Tab = QtWidgets.QWidget()
        self.i5Tab.setObjectName("i5Tab")
        self.verticalLayout_18 = QtWidgets.QVBoxLayout(self.i5Tab)
        self.verticalLayout_18.setObjectName("verticalLayout_18")
        self.workbenchTabs.addTab(self.i5Tab, "")
        self.i6Tab = QtWidgets.QWidget()
        self.i6Tab.setObjectName("i6Tab")
        self.verticalLayout_19 = QtWidgets.QVBoxLayout(self.i6Tab)
        self.verticalLayout_19.setObjectName("verticalLayout_19")
        self.workbenchTabs.addTab(self.i6Tab, "")
        self.i7Tab = QtWidgets.QWidget()
        self.i7Tab.setObjectName("i7Tab")
        self.verticalLayout_20 = QtWidgets.QVBoxLayout(self.i7Tab)
        self.verticalLayout_20.setObjectName("verticalLayout_20")
        self.workbenchTabs.addTab(self.i7Tab, "")
        self.i8Tab = QtWidgets.QWidget()
        self.i8Tab.setObjectName("i8Tab")
        self.verticalLayout_21 = QtWidgets.QVBoxLayout(self.i8Tab)
        self.verticalLayout_21.setObjectName("verticalLayout_21")
        self.workbenchTabs.addTab(self.i8Tab, "")
        self.gridLayout_4.addWidget(self.workbenchTabs, 0, 0, 1, 1)
        self.overallTabsContainer.addTab(self.workbenchTabsContainer, "")
        self.gridLayout_2.addWidget(self.overallTabsContainer, 0, 1, 1, 1)
        self.settingsContainer = QtWidgets.QWidget(self.centralWidget)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Fixed, QtWidgets.QSizePolicy.Preferred)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.settingsContainer.sizePolicy().hasHeightForWidth())
        self.settingsContainer.setSizePolicy(sizePolicy)
        self.settingsContainer.setMinimumSize(QtCore.QSize(300, 0))
        self.settingsContainer.setMaximumSize(QtCore.QSize(300, 896))
        font = QtGui.QFont()
        font.setPointSize(12)
        font.setBold(False)
        font.setWeight(50)
        self.settingsContainer.setFont(font)
        self.settingsContainer.setFocusPolicy(QtCore.Qt.ClickFocus)
        self.settingsContainer.setObjectName("settingsContainer")
        self.gradientThresholdCheckBox = QtWidgets.QCheckBox(self.settingsContainer)
        self.gradientThresholdCheckBox.setGeometry(QtCore.QRect(10, 89, 188, 24))
        self.gradientThresholdCheckBox.setMaximumSize(QtCore.QSize(373, 16777215))
        font = QtGui.QFont()
        font.setPointSize(11)
        font.setBold(True)
        font.setWeight(75)
        self.gradientThresholdCheckBox.setFont(font)
        self.gradientThresholdCheckBox.setObjectName("gradientThresholdCheckBox")
        self.gradientThresholdLineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.gradientThresholdLineEdit.setGeometry(QtCore.QRect(240, 88, 50, 29))
        self.gradientThresholdLineEdit.setMaximumSize(QtCore.QSize(373, 16777215))
        self.gradientThresholdLineEdit.setObjectName("gradientThresholdLineEdit")
        self.unsharpGaussianLowLineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.unsharpGaussianLowLineEdit.setGeometry(QtCore.QRect(240, 147, 50, 28))
        self.unsharpGaussianLowLineEdit.setMaximumSize(QtCore.QSize(373, 16777215))
        self.unsharpGaussianLowLineEdit.setObjectName("unsharpGaussianLowLineEdit")
        self.unsharpGaussianHighLineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.unsharpGaussianHighLineEdit.setGeometry(QtCore.QRect(240, 178, 50, 29))
        self.unsharpGaussianHighLineEdit.setMaximumSize(QtCore.QSize(373, 16777215))
        self.unsharpGaussianHighLineEdit.setObjectName("unsharpGaussianHighLineEdit")
        self.unsharpHFScaleLineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.unsharpHFScaleLineEdit.setGeometry(QtCore.QRect(240, 210, 50, 27))
        self.unsharpHFScaleLineEdit.setMaximumSize(QtCore.QSize(373, 16777215))
        self.unsharpHFScaleLineEdit.setObjectName("unsharpHFScaleLineEdit")
        self.processButton = QtWidgets.QPushButton(self.settingsContainer)
        self.processButton.setGeometry(QtCore.QRect(200, 30, 75, 27))
        self.processButton.setMaximumSize(QtCore.QSize(373, 16777215))
        self.processButton.setObjectName("processButton")
        self.attenuationCheckBox = QtWidgets.QCheckBox(self.settingsContainer)
        self.attenuationCheckBox.setGeometry(QtCore.QRect(10, 634, 210, 24))
        font = QtGui.QFont()
        font.setPointSize(11)
        font.setBold(True)
        font.setWeight(75)
        self.attenuationCheckBox.setFont(font)
        self.attenuationCheckBox.setObjectName("attenuationCheckBox")
        self.labelSetings = QtWidgets.QLabel(self.settingsContainer)
        self.labelSetings.setGeometry(QtCore.QRect(-1, 35, 181, 21))
        font = QtGui.QFont()
        font.setPointSize(16)
        font.setBold(False)
        font.setWeight(50)
        self.labelSetings.setFont(font)
        self.labelSetings.setAlignment(QtCore.Qt.AlignCenter)
        self.labelSetings.setObjectName("labelSetings")
        self.attenuationDecayLineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.attenuationDecayLineEdit.setGeometry(QtCore.QRect(240, 690, 50, 29))
        self.attenuationDecayLineEdit.setObjectName("attenuationDecayLineEdit")
        self.attenuationFactorLineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.attenuationFactorLineEdit.setGeometry(QtCore.QRect(240, 658, 50, 28))
        self.attenuationFactorLineEdit.setObjectName("attenuationFactorLineEdit")
        self.labelAttenuationFactor = QtWidgets.QLabel(self.settingsContainer)
        self.labelAttenuationFactor.setGeometry(QtCore.QRect(20, 662, 171, 24))
        font = QtGui.QFont()
        font.setPointSize(11)
        font.setBold(False)
        font.setWeight(50)
        self.labelAttenuationFactor.setFont(font)
        self.labelAttenuationFactor.setObjectName("labelAttenuationFactor")
        self.labelAttenuationDecay = QtWidgets.QLabel(self.settingsContainer)
        self.labelAttenuationDecay.setGeometry(QtCore.QRect(20, 692, 191, 24))
        font = QtGui.QFont()
        font.setPointSize(11)
        font.setBold(False)
        font.setWeight(50)
        self.labelAttenuationDecay.setFont(font)
        self.labelAttenuationDecay.setObjectName("labelAttenuationDecay")
        self.unsharpMaskingCheckBox = QtWidgets.QCheckBox(self.settingsContainer)
        self.unsharpMaskingCheckBox.setGeometry(QtCore.QRect(10, 127, 177, 24))
        font = QtGui.QFont()
        font.setPointSize(11)
        font.setBold(True)
        font.setWeight(75)
        self.unsharpMaskingCheckBox.setFont(font)
        self.unsharpMaskingCheckBox.setObjectName("unsharpMaskingCheckBox")
        self.p1CheckBox = QtWidgets.QCheckBox(self.settingsContainer)
        self.p1CheckBox.setGeometry(QtCore.QRect(32, 395, 165, 24))
        font = QtGui.QFont()
        font.setFamily("MS Shell Dlg 2")
        font.setPointSize(10)
        font.setBold(False)
        font.setWeight(50)
        self.p1CheckBox.setFont(font)
        self.p1CheckBox.setObjectName("p1CheckBox")
        self.p2CheckBox = QtWidgets.QCheckBox(self.settingsContainer)
        self.p2CheckBox.setGeometry(QtCore.QRect(32, 423, 204, 24))
        font = QtGui.QFont()
        font.setPointSize(10)
        font.setBold(False)
        font.setWeight(50)
        self.p2CheckBox.setFont(font)
        self.p2CheckBox.setObjectName("p2CheckBox")
        self.labelExperimental = QtWidgets.QLabel(self.settingsContainer)
        self.labelExperimental.setGeometry(QtCore.QRect(18, 367, 157, 22))
        font = QtGui.QFont()
        font.setPointSize(13)
        font.setBold(True)
        font.setWeight(75)
        self.labelExperimental.setFont(font)
        self.labelExperimental.setObjectName("labelExperimental")
        self.p1LineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.p1LineEdit.setGeometry(QtCore.QRect(240, 388, 50, 27))
        self.p1LineEdit.setMaximumSize(QtCore.QSize(373, 16777215))
        self.p1LineEdit.setObjectName("p1LineEdit")
        self.p2LineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.p2LineEdit.setGeometry(QtCore.QRect(240, 418, 50, 27))
        self.p2LineEdit.setMaximumSize(QtCore.QSize(373, 16777215))
        self.p2LineEdit.setObjectName("p2LineEdit")
        self.p3LineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.p3LineEdit.setGeometry(QtCore.QRect(240, 447, 50, 27))
        self.p3LineEdit.setMaximumSize(QtCore.QSize(373, 16777215))
        self.p3LineEdit.setObjectName("p3LineEdit")
        self.p3CheckBox = QtWidgets.QCheckBox(self.settingsContainer)
        self.p3CheckBox.setGeometry(QtCore.QRect(32, 452, 201, 24))
        font = QtGui.QFont()
        font.setPointSize(10)
        font.setBold(False)
        font.setWeight(50)
        self.p3CheckBox.setFont(font)
        self.p3CheckBox.setObjectName("p3CheckBox")
        self.p4LineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.p4LineEdit.setGeometry(QtCore.QRect(240, 477, 50, 27))
        self.p4LineEdit.setMaximumSize(QtCore.QSize(373, 16777215))
        self.p4LineEdit.setObjectName("p4LineEdit")
        self.p4CheckBox = QtWidgets.QCheckBox(self.settingsContainer)
        self.p4CheckBox.setGeometry(QtCore.QRect(32, 482, 191, 24))
        font = QtGui.QFont()
        font.setPointSize(10)
        font.setBold(False)
        font.setWeight(50)
        self.p4CheckBox.setFont(font)
        self.p4CheckBox.setObjectName("p4CheckBox")
        self.p6LineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.p6LineEdit.setGeometry(QtCore.QRect(240, 538, 50, 27))
        self.p6LineEdit.setMaximumSize(QtCore.QSize(373, 16777215))
        self.p6LineEdit.setObjectName("p6LineEdit")
        self.p5CheckBox = QtWidgets.QCheckBox(self.settingsContainer)
        self.p5CheckBox.setGeometry(QtCore.QRect(32, 512, 190, 24))
        font = QtGui.QFont()
        font.setPointSize(10)
        font.setBold(False)
        font.setWeight(50)
        self.p5CheckBox.setFont(font)
        self.p5CheckBox.setObjectName("p5CheckBox")
        self.p7LineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.p7LineEdit.setGeometry(QtCore.QRect(240, 569, 50, 27))
        self.p7LineEdit.setMaximumSize(QtCore.QSize(373, 16777215))
        self.p7LineEdit.setObjectName("p7LineEdit")
        self.p6CheckBox = QtWidgets.QCheckBox(self.settingsContainer)
        self.p6CheckBox.setGeometry(QtCore.QRect(32, 542, 158, 24))
        font = QtGui.QFont()
        font.setPointSize(10)
        font.setBold(False)
        font.setWeight(50)
        self.p6CheckBox.setFont(font)
        self.p6CheckBox.setObjectName("p6CheckBox")
        self.p8LineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.p8LineEdit.setEnabled(True)
        self.p8LineEdit.setGeometry(QtCore.QRect(240, 600, 50, 27))
        self.p8LineEdit.setMaximumSize(QtCore.QSize(373, 16777215))
        font = QtGui.QFont()
        font.setPointSize(12)
        font.setBold(False)
        font.setWeight(50)
        self.p8LineEdit.setFont(font)
        self.p8LineEdit.setObjectName("p8LineEdit")
        self.p7CheckBox = QtWidgets.QCheckBox(self.settingsContainer)
        self.p7CheckBox.setGeometry(QtCore.QRect(32, 572, 187, 24))
        font = QtGui.QFont()
        font.setPointSize(10)
        font.setBold(False)
        font.setWeight(50)
        self.p7CheckBox.setFont(font)
        self.p7CheckBox.setObjectName("p7CheckBox")
        self.p8CheckBox = QtWidgets.QCheckBox(self.settingsContainer)
        self.p8CheckBox.setGeometry(QtCore.QRect(32, 602, 221, 24))
        font = QtGui.QFont()
        font.setPointSize(10)
        font.setBold(False)
        font.setWeight(50)
        self.p8CheckBox.setFont(font)
        self.p8CheckBox.setObjectName("p8CheckBox")
        self.p5LineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.p5LineEdit.setGeometry(QtCore.QRect(240, 508, 50, 27))
        self.p5LineEdit.setMaximumSize(QtCore.QSize(373, 16777215))
        self.p5LineEdit.setObjectName("p5LineEdit")
        self.labelProcessing = QtWidgets.QLabel(self.settingsContainer)
        self.labelProcessing.setGeometry(QtCore.QRect(9, -2, 141, 32))
        self.labelProcessing.setObjectName("labelProcessing")
        self.fileOBJCheckBox = QtWidgets.QCheckBox(self.settingsContainer)
        self.fileOBJCheckBox.setGeometry(QtCore.QRect(32, 310, 165, 24))
        font = QtGui.QFont()
        font.setPointSize(11)
        font.setBold(False)
        font.setWeight(50)
        self.fileOBJCheckBox.setFont(font)
        self.fileOBJCheckBox.setObjectName("fileOBJCheckBox")
        self.labelGaussianLow = QtWidgets.QLabel(self.settingsContainer)
        self.labelGaussianLow.setGeometry(QtCore.QRect(32, 155, 131, 16))
        self.labelGaussianLow.setObjectName("labelGaussianLow")
        self.labelGaussianHigh = QtWidgets.QLabel(self.settingsContainer)
        self.labelGaussianHigh.setGeometry(QtCore.QRect(32, 185, 131, 18))
        self.labelGaussianHigh.setObjectName("labelGaussianHigh")
        self.labelHighFrequencyScaling = QtWidgets.QLabel(self.settingsContainer)
        self.labelHighFrequencyScaling.setGeometry(QtCore.QRect(32, 212, 201, 18))
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Preferred, QtWidgets.QSizePolicy.Preferred)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.labelHighFrequencyScaling.sizePolicy().hasHeightForWidth())
        self.labelHighFrequencyScaling.setSizePolicy(sizePolicy)
        self.labelHighFrequencyScaling.setObjectName("labelHighFrequencyScaling")
        self.fileOutputCheckbox = QtWidgets.QCheckBox(self.settingsContainer)
        self.fileOutputCheckbox.setGeometry(QtCore.QRect(10, 288, 177, 24))
        font = QtGui.QFont()
        font.setPointSize(11)
        font.setBold(True)
        font.setWeight(75)
        self.fileOutputCheckbox.setFont(font)
        self.fileOutputCheckbox.setObjectName("fileOutputCheckbox")
        self.reliefScaleLineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.reliefScaleLineEdit.setGeometry(QtCore.QRect(240, 248, 50, 27))
        self.reliefScaleLineEdit.setMaximumSize(QtCore.QSize(373, 16777215))
        self.reliefScaleLineEdit.setObjectName("reliefScaleLineEdit")
        self.labelReliefScale = QtWidgets.QLabel(self.settingsContainer)
        self.labelReliefScale.setGeometry(QtCore.QRect(10, 250, 201, 18))
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Preferred, QtWidgets.QSizePolicy.Preferred)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.labelReliefScale.sizePolicy().hasHeightForWidth())
        self.labelReliefScale.setSizePolicy(sizePolicy)
        font = QtGui.QFont()
        font.setPointSize(11)
        font.setBold(True)
        font.setWeight(75)
        self.labelReliefScale.setFont(font)
        self.labelReliefScale.setObjectName("labelReliefScale")
        self.line = QtWidgets.QFrame(self.settingsContainer)
        self.line.setGeometry(QtCore.QRect(10, 340, 271, 16))
        self.line.setFrameShape(QtWidgets.QFrame.HLine)
        self.line.setFrameShadow(QtWidgets.QFrame.Sunken)
        self.line.setObjectName("line")
        self.gridLayout_2.addWidget(self.settingsContainer, 0, 0, 1, 1)
        MainWindow.setCentralWidget(self.centralWidget)
        self.menubar = QtWidgets.QMenuBar(MainWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 1171, 26))
        font = QtGui.QFont()
        font.setPointSize(13)
        self.menubar.setFont(font)
        self.menubar.setObjectName("menubar")
        self.menuFile = QtWidgets.QMenu(self.menubar)
        self.menuFile.setObjectName("menuFile")
        MainWindow.setMenuBar(self.menubar)
        self.statusbar = QtWidgets.QStatusBar(MainWindow)
        self.statusbar.setObjectName("statusbar")
        MainWindow.setStatusBar(self.statusbar)
        self.actionOpen = QtWidgets.QAction(MainWindow)
        self.actionOpen.setObjectName("actionOpen")
        self.menuFile.addAction(self.actionOpen)
        self.menubar.addAction(self.menuFile.menuAction())

        self.retranslateUi(MainWindow)
        self.overallTabsContainer.setCurrentIndex(0)
        self.imageTabs.setCurrentIndex(0)
        self.modelTabs.setCurrentIndex(0)
        self.workbenchTabs.setCurrentIndex(0)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)
        MainWindow.setTabOrder(self.processButton, self.gradientThresholdCheckBox)
        MainWindow.setTabOrder(self.gradientThresholdCheckBox, self.gradientThresholdLineEdit)
        MainWindow.setTabOrder(self.gradientThresholdLineEdit, self.unsharpMaskingCheckBox)
        MainWindow.setTabOrder(self.unsharpMaskingCheckBox, self.unsharpGaussianLowLineEdit)
        MainWindow.setTabOrder(self.unsharpGaussianLowLineEdit, self.unsharpGaussianHighLineEdit)
        MainWindow.setTabOrder(self.unsharpGaussianHighLineEdit, self.unsharpHFScaleLineEdit)
        MainWindow.setTabOrder(self.unsharpHFScaleLineEdit, self.fileOutputCheckbox)
        MainWindow.setTabOrder(self.fileOutputCheckbox, self.fileOBJCheckBox)
        MainWindow.setTabOrder(self.fileOBJCheckBox, self.p1CheckBox)
        MainWindow.setTabOrder(self.p1CheckBox, self.p1LineEdit)
        MainWindow.setTabOrder(self.p1LineEdit, self.p2CheckBox)
        MainWindow.setTabOrder(self.p2CheckBox, self.p2LineEdit)
        MainWindow.setTabOrder(self.p2LineEdit, self.p3CheckBox)
        MainWindow.setTabOrder(self.p3CheckBox, self.p3LineEdit)
        MainWindow.setTabOrder(self.p3LineEdit, self.p4CheckBox)
        MainWindow.setTabOrder(self.p4CheckBox, self.p4LineEdit)
        MainWindow.setTabOrder(self.p4LineEdit, self.p5CheckBox)
        MainWindow.setTabOrder(self.p5CheckBox, self.p5LineEdit)
        MainWindow.setTabOrder(self.p5LineEdit, self.p6CheckBox)
        MainWindow.setTabOrder(self.p6CheckBox, self.p6LineEdit)
        MainWindow.setTabOrder(self.p6LineEdit, self.p7CheckBox)
        MainWindow.setTabOrder(self.p7CheckBox, self.p7LineEdit)
        MainWindow.setTabOrder(self.p7LineEdit, self.p8CheckBox)
        MainWindow.setTabOrder(self.p8CheckBox, self.p8LineEdit)
        MainWindow.setTabOrder(self.p8LineEdit, self.attenuationCheckBox)
        MainWindow.setTabOrder(self.attenuationCheckBox, self.attenuationFactorLineEdit)
        MainWindow.setTabOrder(self.attenuationFactorLineEdit, self.attenuationDecayLineEdit)
        MainWindow.setTabOrder(self.attenuationDecayLineEdit, self.imageTabs)
        MainWindow.setTabOrder(self.imageTabs, self.workbenchTabs)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "Explorer"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.depthBufferTab), _translate("MainWindow", "&DepthBuffer"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.reliefTab), _translate("MainWindow", "&Relief"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.backgroundMaskTab), _translate("MainWindow", "&Background Mask"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.gradientXTab), _translate("MainWindow", "Gradient &X (dI/dx)"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.gradientXMaskTab), _translate("MainWindow", "Gradient X Mask"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.gradientYTab), _translate("MainWindow", "Gradient &Y (dI/dy)"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.gradientYMaskTab), _translate("MainWindow", "Gradient Y Mask"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.compositeMaskTab), _translate("MainWindow", "&Composite Mask"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.gradientXUnsharpTab), _translate("MainWindow", "Gradient X Unsharp"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.gradientYUnsharpTab), _translate("MainWindow", "Gradient Y Unsharp"))
        self.overallTabsContainer.setTabText(self.overallTabsContainer.indexOf(self.imageTabsContainer), _translate("MainWindow", "Images"))
        self.modelTabs.setTabText(self.modelTabs.indexOf(self.modelMeshTab), _translate("MainWindow", "&Model"))
        self.modelTabs.setTabText(self.modelTabs.indexOf(self.modelMeshScaledTab), _translate("MainWindow", "Model &Scaled"))
        self.modelTabs.setTabText(self.modelTabs.indexOf(self.reliefMeshTab), _translate("MainWindow", "&Relief"))
        self.overallTabsContainer.setTabText(self.overallTabsContainer.indexOf(self.modelTabsContainer), _translate("MainWindow", "3D Mesh"))
        self.workbenchTabs.setTabText(self.workbenchTabs.indexOf(self.i1Tab), _translate("MainWindow", "I1"))
        self.workbenchTabs.setTabText(self.workbenchTabs.indexOf(self.i2Tab), _translate("MainWindow", "I2"))
        self.workbenchTabs.setTabText(self.workbenchTabs.indexOf(self.i3Tab), _translate("MainWindow", "I3"))
        self.workbenchTabs.setTabText(self.workbenchTabs.indexOf(self.i4Tab), _translate("MainWindow", "I4"))
        self.workbenchTabs.setTabText(self.workbenchTabs.indexOf(self.i5Tab), _translate("MainWindow", "I5"))
        self.workbenchTabs.setTabText(self.workbenchTabs.indexOf(self.i6Tab), _translate("MainWindow", "I6"))
        self.workbenchTabs.setTabText(self.workbenchTabs.indexOf(self.i7Tab), _translate("MainWindow", "I7"))
        self.workbenchTabs.setTabText(self.workbenchTabs.indexOf(self.i8Tab), _translate("MainWindow", "I8"))
        self.overallTabsContainer.setTabText(self.overallTabsContainer.indexOf(self.workbenchTabsContainer), _translate("MainWindow", "Workbench"))
        self.gradientThresholdCheckBox.setText(_translate("MainWindow", "&Gradient Threshold"))
        self.processButton.setText(_translate("MainWindow", "&Process"))
        self.attenuationCheckBox.setText(_translate("MainWindow", "Gradient &Attenuation"))
        self.labelSetings.setText(_translate("MainWindow", "MeshTransform"))
        self.labelAttenuationFactor.setText(_translate("MainWindow", "a: ~F * mean gradient"))
        self.labelAttenuationDecay.setText(_translate("MainWindow", "b: ~(1 / rate of decay)"))
        self.unsharpMaskingCheckBox.setText(_translate("MainWindow", "&Unsharp Masking"))
        self.p1CheckBox.setText(_translate("MainWindow", "P1"))
        self.p2CheckBox.setText(_translate("MainWindow", "P2"))
        self.labelExperimental.setText(_translate("MainWindow", "Experimental"))
        self.p3CheckBox.setText(_translate("MainWindow", "P3"))
        self.p4CheckBox.setText(_translate("MainWindow", "P4"))
        self.p5CheckBox.setText(_translate("MainWindow", "P5"))
        self.p6CheckBox.setText(_translate("MainWindow", "P6"))
        self.p7CheckBox.setText(_translate("MainWindow", "P7"))
        self.p8CheckBox.setText(_translate("MainWindow", "P8"))
        self.labelProcessing.setText(_translate("MainWindow", "<html><head/><body><p><span style=\" font-size:18pt; color:#ff0000;\">Processing</span></p></body></html>"))
        self.fileOBJCheckBox.setText(_translate("MainWindow", "&Wavefront OBJ"))
        self.labelGaussianLow.setText(_translate("MainWindow", "Gaussian Low"))
        self.labelGaussianHigh.setText(_translate("MainWindow", "Gaussian High"))
        self.labelHighFrequencyScaling.setText(_translate("MainWindow", "High Frequency Scaling"))
        self.fileOutputCheckbox.setText(_translate("MainWindow", "File Output"))
        self.labelReliefScale.setText(_translate("MainWindow", "Relief Scale (%)"))
        self.menuFile.setTitle(_translate("MainWindow", "File"))
        self.actionOpen.setText(_translate("MainWindow", "Open"))
import explorer_rc
