# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'Solver/explorer.ui'
#
# Created by: PyQt5 UI code generator 5.6
#
# WARNING! All changes made in this file will be lost!

from PyQt5 import QtCore, QtGui, QtWidgets

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(981, 812)
        self.centralWidget = QtWidgets.QWidget(MainWindow)
        self.centralWidget.setFocusPolicy(QtCore.Qt.NoFocus)
        self.centralWidget.setObjectName("centralWidget")
        self.gridLayout = QtWidgets.QGridLayout(self.centralWidget)
        self.gridLayout.setObjectName("gridLayout")
        self.overalTabsContainer = QtWidgets.QTabWidget(self.centralWidget)
        self.overalTabsContainer.setFocusPolicy(QtCore.Qt.NoFocus)
        self.overalTabsContainer.setTabPosition(QtWidgets.QTabWidget.East)
        self.overalTabsContainer.setObjectName("overalTabsContainer")
        self.imageTabsContainer = QtWidgets.QWidget()
        self.imageTabsContainer.setFocusPolicy(QtCore.Qt.TabFocus)
        self.imageTabsContainer.setObjectName("imageTabsContainer")
        self.gridLayout_2 = QtWidgets.QGridLayout(self.imageTabsContainer)
        self.gridLayout_2.setContentsMargins(0, 0, 0, 0)
        self.gridLayout_2.setObjectName("gridLayout_2")
        self.imageTabs = QtWidgets.QTabWidget(self.imageTabsContainer)
        self.imageTabs.setFocusPolicy(QtCore.Qt.StrongFocus)
        self.imageTabs.setObjectName("imageTabs")
        self.depthBufferTab = QtWidgets.QWidget()
        self.depthBufferTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.depthBufferTab.setObjectName("depthBufferTab")
        self.verticalLayout_2 = QtWidgets.QVBoxLayout(self.depthBufferTab)
        self.verticalLayout_2.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout_2.setObjectName("verticalLayout_2")
        self.imageTabs.addTab(self.depthBufferTab, "")
        self.backgroundMaskTab = QtWidgets.QWidget()
        self.backgroundMaskTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.backgroundMaskTab.setObjectName("backgroundMaskTab")
        self.verticalLayout_3 = QtWidgets.QVBoxLayout(self.backgroundMaskTab)
        self.verticalLayout_3.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout_3.setObjectName("verticalLayout_3")
        self.imageTabs.addTab(self.backgroundMaskTab, "")
        self.gradientXTab = QtWidgets.QWidget()
        self.gradientXTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.gradientXTab.setObjectName("gradientXTab")
        self.verticalLayout_4 = QtWidgets.QVBoxLayout(self.gradientXTab)
        self.verticalLayout_4.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout_4.setObjectName("verticalLayout_4")
        self.imageTabs.addTab(self.gradientXTab, "")
        self.gradientXMaskTab = QtWidgets.QWidget()
        self.gradientXMaskTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.gradientXMaskTab.setObjectName("gradientXMaskTab")
        self.verticalLayout_5 = QtWidgets.QVBoxLayout(self.gradientXMaskTab)
        self.verticalLayout_5.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout_5.setObjectName("verticalLayout_5")
        self.imageTabs.addTab(self.gradientXMaskTab, "")
        self.gradientYTab = QtWidgets.QWidget()
        self.gradientYTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.gradientYTab.setObjectName("gradientYTab")
        self.verticalLayout_6 = QtWidgets.QVBoxLayout(self.gradientYTab)
        self.verticalLayout_6.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout_6.setObjectName("verticalLayout_6")
        self.imageTabs.addTab(self.gradientYTab, "")
        self.gradientYMaskTab = QtWidgets.QWidget()
        self.gradientYMaskTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.gradientYMaskTab.setObjectName("gradientYMaskTab")
        self.verticalLayout_7 = QtWidgets.QVBoxLayout(self.gradientYMaskTab)
        self.verticalLayout_7.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout_7.setObjectName("verticalLayout_7")
        self.imageTabs.addTab(self.gradientYMaskTab, "")
        self.compositeMaskTab = QtWidgets.QWidget()
        self.compositeMaskTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.compositeMaskTab.setObjectName("compositeMaskTab")
        self.verticalLayout_8 = QtWidgets.QVBoxLayout(self.compositeMaskTab)
        self.verticalLayout_8.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout_8.setObjectName("verticalLayout_8")
        self.imageTabs.addTab(self.compositeMaskTab, "")
        self.gridLayout_2.addWidget(self.imageTabs, 0, 0, 1, 1)
        self.overalTabsContainer.addTab(self.imageTabsContainer, "")
        self.modelTabsContainer = QtWidgets.QWidget()
        self.modelTabsContainer.setFocusPolicy(QtCore.Qt.TabFocus)
        self.modelTabsContainer.setObjectName("modelTabsContainer")
        self.gridLayout_3 = QtWidgets.QGridLayout(self.modelTabsContainer)
        self.gridLayout_3.setContentsMargins(0, 0, 0, 0)
        self.gridLayout_3.setObjectName("gridLayout_3")
        self.modelTabs = QtWidgets.QTabWidget(self.modelTabsContainer)
        self.modelTabs.setFocusPolicy(QtCore.Qt.StrongFocus)
        self.modelTabs.setObjectName("modelTabs")
        self.isometricViewTab = QtWidgets.QWidget()
        self.isometricViewTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.isometricViewTab.setObjectName("isometricViewTab")
        self.verticalLayout_10 = QtWidgets.QVBoxLayout(self.isometricViewTab)
        self.verticalLayout_10.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout_10.setObjectName("verticalLayout_10")
        self.modelTabs.addTab(self.isometricViewTab, "")
        self.topViewTab = QtWidgets.QWidget()
        self.topViewTab.setFocusPolicy(QtCore.Qt.TabFocus)
        self.topViewTab.setObjectName("topViewTab")
        self.verticalLayout_9 = QtWidgets.QVBoxLayout(self.topViewTab)
        self.verticalLayout_9.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout_9.setObjectName("verticalLayout_9")
        self.modelTabs.addTab(self.topViewTab, "")
        self.gridLayout_3.addWidget(self.modelTabs, 0, 0, 1, 1)
        self.overalTabsContainer.addTab(self.modelTabsContainer, "")
        self.gridLayout.addWidget(self.overalTabsContainer, 0, 1, 1, 1)
        self.settingsContainer = QtWidgets.QWidget(self.centralWidget)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Fixed, QtWidgets.QSizePolicy.Preferred)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.settingsContainer.sizePolicy().hasHeightForWidth())
        self.settingsContainer.setSizePolicy(sizePolicy)
        self.settingsContainer.setFocusPolicy(QtCore.Qt.NoFocus)
        self.settingsContainer.setObjectName("settingsContainer")
        self.formLayout = QtWidgets.QFormLayout(self.settingsContainer)
        self.formLayout.setSizeConstraint(QtWidgets.QLayout.SetMinAndMaxSize)
        self.formLayout.setContentsMargins(0, 0, 0, 0)
        self.formLayout.setObjectName("formLayout")
        self.tauLabel = QtWidgets.QLabel(self.settingsContainer)
        self.tauLabel.setObjectName("tauLabel")
        self.formLayout.setWidget(1, QtWidgets.QFormLayout.LabelRole, self.tauLabel)
        self.tauLineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.tauLineEdit.setObjectName("tauLineEdit")
        self.formLayout.setWidget(1, QtWidgets.QFormLayout.FieldRole, self.tauLineEdit)
        self.processButton = QtWidgets.QPushButton(self.settingsContainer)
        self.processButton.setObjectName("processButton")
        self.formLayout.setWidget(9, QtWidgets.QFormLayout.FieldRole, self.processButton)
        self.lambdaLabel = QtWidgets.QLabel(self.settingsContainer)
        self.lambdaLabel.setObjectName("lambdaLabel")
        self.formLayout.setWidget(5, QtWidgets.QFormLayout.LabelRole, self.lambdaLabel)
        self.lambdaLineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.lambdaLineEdit.setObjectName("lambdaLineEdit")
        self.formLayout.setWidget(5, QtWidgets.QFormLayout.FieldRole, self.lambdaLineEdit)
        self.gaussianBlurLabel = QtWidgets.QLabel(self.settingsContainer)
        self.gaussianBlurLabel.setObjectName("gaussianBlurLabel")
        self.formLayout.setWidget(2, QtWidgets.QFormLayout.LabelRole, self.gaussianBlurLabel)
        self.gaussianBlurLineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.gaussianBlurLineEdit.setObjectName("gaussianBlurLineEdit")
        self.formLayout.setWidget(2, QtWidgets.QFormLayout.FieldRole, self.gaussianBlurLineEdit)
        self.gaussianSmoothLineEdit = QtWidgets.QLineEdit(self.settingsContainer)
        self.gaussianSmoothLineEdit.setObjectName("gaussianSmoothLineEdit")
        self.formLayout.setWidget(3, QtWidgets.QFormLayout.FieldRole, self.gaussianSmoothLineEdit)
        self.gaussianSmoothLabel = QtWidgets.QLabel(self.settingsContainer)
        self.gaussianSmoothLabel.setObjectName("gaussianSmoothLabel")
        self.formLayout.setWidget(3, QtWidgets.QFormLayout.LabelRole, self.gaussianSmoothLabel)
        self.gridLayout.addWidget(self.settingsContainer, 0, 0, 1, 1)
        MainWindow.setCentralWidget(self.centralWidget)
        self.menubar = QtWidgets.QMenuBar(MainWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 981, 21))
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
        self.overalTabsContainer.setCurrentIndex(1)
        self.imageTabs.setCurrentIndex(6)
        self.modelTabs.setCurrentIndex(0)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)
        MainWindow.setTabOrder(self.tauLineEdit, self.gaussianBlurLineEdit)
        MainWindow.setTabOrder(self.gaussianBlurLineEdit, self.gaussianSmoothLineEdit)
        MainWindow.setTabOrder(self.gaussianSmoothLineEdit, self.lambdaLineEdit)
        MainWindow.setTabOrder(self.lambdaLineEdit, self.processButton)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "Explorer"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.depthBufferTab), _translate("MainWindow", "DepthBuffer"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.backgroundMaskTab), _translate("MainWindow", "Background Mask"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.gradientXTab), _translate("MainWindow", "Gradient X (dI/dx)"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.gradientXMaskTab), _translate("MainWindow", "Gradient X Mask"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.gradientYTab), _translate("MainWindow", "Gradient Y (dI/dy)"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.gradientYMaskTab), _translate("MainWindow", "Gradient Y Mak"))
        self.imageTabs.setTabText(self.imageTabs.indexOf(self.compositeMaskTab), _translate("MainWindow", "Composite Mask"))
        self.overalTabsContainer.setTabText(self.overalTabsContainer.indexOf(self.imageTabsContainer), _translate("MainWindow", "Images"))
        self.modelTabs.setTabText(self.modelTabs.indexOf(self.isometricViewTab), _translate("MainWindow", "Isometric"))
        self.modelTabs.setTabText(self.modelTabs.indexOf(self.topViewTab), _translate("MainWindow", "Top"))
        self.overalTabsContainer.setTabText(self.overalTabsContainer.indexOf(self.modelTabsContainer), _translate("MainWindow", "3D Mesh"))
        self.tauLabel.setText(_translate("MainWindow", "Tau Threshold"))
        self.processButton.setText(_translate("MainWindow", "Process"))
        self.lambdaLabel.setText(_translate("MainWindow", "Lambda"))
        self.gaussianBlurLabel.setText(_translate("MainWindow", "Gaussian Blur"))
        self.gaussianSmoothLabel.setText(_translate("MainWindow", "Gaussian Smooth"))
        self.menuFile.setTitle(_translate("MainWindow", "File"))
        self.actionOpen.setText(_translate("MainWindow", "Open"))

